import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { Box, Button, Collapse, IconButton, Table, TableBody, TableHead, Typography, Tab, Paper, BottomNavigation, BottomNavigationAction, Container, Card, CardContent, Grid, LinearProgress, Chip, TextField, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon, School as SchoolIcon, Person as PersonIcon, Class as ClassIcon } from '@mui/icons-material';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart'
import CustomPieChart from '../../../components/CustomPieChart'
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import Popup from '../../../components/Popup';

const ViewStudent = () => {
    const [showTab, setShowTab] = useState(false);

    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()
    const { userDetails, response, loading, error } = useSelector((state) => state.user);

    const studentID = params.id
    const address = "Student"

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID])

    useEffect(() => {
        if (userDetails && userDetails.sclassName && userDetails.sclassName._id !== undefined) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState('');
    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const [openStates, setOpenStates] = useState({});

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [selectedSection, setSelectedSection] = useState('table');
    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const fields = password === ""
        ? { name, rollNum }
        : { name, rollNum, password }

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setRollNum(userDetails.rollNum || '');
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || '');
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const submitHandler = (event) => {
        event.preventDefault()
        dispatch(updateUser(fields, studentID, address))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const deleteHandler = () => {
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)

        // dispatch(deleteUser(studentID, address))
        //     .then(() => {
        //         navigate(-1)
        //     })
    }

    const removeHandler = (id, deladdress) => {
        dispatch(removeStuff(id, deladdress))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
    }

    const removeSubAttendance = (subId) => {
        dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten"))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
    }

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const StudentAttendanceSection = () => {
        const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
        const [deleteAllConfirmOpen, setDeleteAllConfirmOpen] = useState(false);
        const [subjectToDelete, setSubjectToDelete] = useState(null);

        const handleDeleteConfirm = () => {
            removeSubAttendance(subjectToDelete);
            setDeleteConfirmOpen(false);
        };

        const handleDeleteAllConfirm = () => {
            removeHandler(studentID, "RemoveStudentAtten");
            setDeleteAllConfirmOpen(false);
        };

        const renderTableSection = () => {
            return (
                <Box sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>Attendance Record</Typography>
                    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Subject</StyledTableCell>
                                    <StyledTableCell>Present</StyledTableCell>
                                    <StyledTableCell>Total Sessions</StyledTableCell>
                                    <StyledTableCell>Attendance Percentage</StyledTableCell>
                                    <StyledTableCell>Last Updated</StyledTableCell>
                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                                const lastUpdated = allData.length > 0 ? new Date(allData[allData.length - 1].date).toLocaleDateString() : 'N/A';
                                return (
                                    <TableBody key={index}>
                                        <StyledTableRow>
                                            <StyledTableCell>{subName}</StyledTableCell>
                                            <StyledTableCell>{present}</StyledTableCell>
                                            <StyledTableCell>{sessions}</StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box sx={{ width: '100%', mr: 1 }}>
                                                        <LinearProgress variant="determinate" value={subjectAttendancePercentage} 
                                                            sx={{
                                                                height: 10,
                                                                borderRadius: 5,
                                                                backgroundColor: '#e0e0e0',
                                                                '& .MuiLinearProgress-bar': {
                                                                    backgroundColor: subjectAttendancePercentage >= 75 ? '#4caf50' : '#f44336',
                                                                    borderRadius: 5,
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box sx={{ minWidth: 35 }}>
                                                        <Typography variant="body2" color="text.secondary">{`${Math.round(subjectAttendancePercentage)}%`}</Typography>
                                                    </Box>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell>{lastUpdated}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Button variant="contained" size="small" sx={{ mr: 1 }}
                                                    onClick={() => handleOpen(subId)}>
                                                    {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
                                                </Button>
                                                <IconButton size="small" onClick={() => {
                                                    setSubjectToDelete(subId);
                                                    setDeleteConfirmOpen(true);
                                                }}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                                <Button variant="contained" size="small" color="primary" sx={{ ml: 1 }}
                                                    onClick={() => navigate(`/Admin/subject/student/attendance/${studentID}/${subId}`)}>
                                                    Change
                                                </Button>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        <StyledTableRow>
                                            <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 1 }}>
                                                        <Typography variant="h6" gutterBottom component="div">
                                                            Attendance Details
                                                        </Typography>
                                                        <Table size="small" aria-label="purchases">
                                                            <TableHead>
                                                                <StyledTableRow>
                                                                    <StyledTableCell>Date</StyledTableCell>
                                                                    <StyledTableCell align="right">Status</StyledTableCell>
                                                                </StyledTableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {allData.map((data, index) => {
                                                                    const date = new Date(data.date);
                                                                    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                    return (
                                                                        <StyledTableRow key={index}>
                                                                            <StyledTableCell component="th" scope="row">
                                                                                {dateString}
                                                                            </StyledTableCell>
                                                                            <StyledTableCell align="right">
                                                                                <Chip 
                                                                                    label={data.status}
                                                                                    color={data.status === 'Present' ? 'success' : 'error'}
                                                                                    size="small"
                                                                                />
                                                                            </StyledTableCell>
                                                                        </StyledTableRow>
                                                                    )
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </Box>
                                                </Collapse>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                )
                            }
                            )}
                        </Table>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">
                                Overall Attendance: {overallAttendancePercentage.toFixed(2)}%
                            </Typography>
                            <Box>
                                <Button variant="contained" color="error" startIcon={<DeleteIcon />} 
                                    onClick={() => setDeleteAllConfirmOpen(true)} sx={{ mr: 2 }}>
                                    Delete All
                                </Button>
                                <Button variant="contained" color="primary"
                                    onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>
                                    Add Attendance
                                </Button>
                            </Box>
                        </Box>
                    </Paper>

                    <Dialog
                        open={deleteConfirmOpen}
                        onClose={() => setDeleteConfirmOpen(false)}
                    >
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this subject's attendance record?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={deleteAllConfirmOpen}
                        onClose={() => setDeleteAllConfirmOpen(false)}
                    >
                        <DialogTitle>Confirm Delete All</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete all attendance records? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteAllConfirmOpen(false)}>Cancel</Button>
                            <Button onClick={handleDeleteAllConfirm} color="error" autoFocus>
                                Delete All
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            )
        }
        const renderChartSection = () => {
            return (
                <Box sx={{ p: 3 }}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>Attendance Analytics</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <CustomPieChart data={chartData} />
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            )
        }

        return (
            <>
                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Table View"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                />
                                <BottomNavigationAction
                                    label="Chart View"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                />
                            </BottomNavigation>
                        </Paper>
                    </>
                    :
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>No attendance records found</Typography>
                        <Button variant="contained" color="primary" 
                            onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>
                            Add Attendance
                        </Button>
                    </Box>
                }
            </>
        )
    }

    const StudentMarksSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <h3>Subject Marks:</h3>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Marks</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {subjectMarks.map((result, index) => {
                                if (!result.subName || !result.marksObtained) {
                                    return null;
                                }
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                        <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>
                        Add Marks
                    </Button>
                </>
            )
        }
        const renderChartSection = () => {
            return (
                <>
                    <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                </>
            )
        }
        return (
            <>
                {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Table"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                />
                                <BottomNavigationAction
                                    label="Chart"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                />
                            </BottomNavigation>
                        </Paper>
                    </>
                    :
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>
                        Add Marks
                    </Button>
                }
            </>
        )
    }
      const StudentDetailsSection = () => {
          return (
              <Box sx={{ p: 3 }}>
                  <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                      <Typography variant="h5" gutterBottom>Student Information</Typography>
                      <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle1" color="text.secondary">Name:</Typography>
                              <Typography variant="body1">{userDetails.name}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle1" color="text.secondary">Roll Number:</Typography>
                              <Typography variant="body1">{userDetails.rollNum}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle1" color="text.secondary">Class:</Typography>
                              <Typography variant="body1">{sclassName.sclassName}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle1" color="text.secondary">School:</Typography>
                              <Typography variant="body1">{studentSchool.schoolName}</Typography>
                          </Grid>
                      </Grid>
                  </Paper>

                  {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 && (
                      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                          <Typography variant="h6" gutterBottom>Attendance Overview</Typography>
                          <CustomPieChart data={chartData} />
                      </Paper>
                  )}

                  <Paper elevation={3} sx={{ p: 4 }}>
                      <Button 
                          variant="contained" 
                          onClick={() => setShowTab(!showTab)}
                          endIcon={showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                          fullWidth
                          sx={{ mb: 2 }}
                      >
                          Edit Student
                      </Button>
                    
                      <Collapse in={showTab} timeout="auto" unmountOnExit>
                          <Box sx={{ maxWidth: '600px', margin: '0 auto' }}>
                              <form onSubmit={submitHandler}>
                                  <Typography variant="h6" gutterBottom>
                                      Edit Details
                                  </Typography>
                                  
                                  <Stack spacing={3}>
                                      <TextField
                                          fullWidth
                                          label="Name"
                                          variant="outlined"
                                          placeholder="Enter user's name..."
                                          value={name}
                                          onChange={(event) => setName(event.target.value)}
                                          autoComplete="name"
                                          required
                                      />

                                      <TextField
                                          fullWidth
                                          label="Roll Number"
                                          variant="outlined"
                                          type="number"
                                          placeholder="Enter user's Roll Number..."
                                          value={rollNum}
                                          onChange={(event) => setRollNum(event.target.value)}
                                          required
                                      />

                                      <TextField
                                          fullWidth
                                          label="Password"
                                          variant="outlined"
                                          type="password"
                                          placeholder="Enter user's password..."
                                          value={password}
                                          onChange={(event) => setPassword(event.target.value)}
                                          autoComplete="new-password"
                                      />

                                      <Button
                                          variant="contained"
                                          type="submit"
                                          fullWidth
                                          sx={{
                                              mt: 2,
                                              bgcolor: 'primary.main',
                                              '&:hover': {
                                                  bgcolor: 'primary.dark',
                                              },
                                          }}
                                      >
                                          Update
                                      </Button>
                                  </Stack>
                              </form>
                          </Box>
                      </Collapse>
                  </Paper>
              </Box>
          )
      }

      return (
          <>
              {loading ? (
                  <div className="loading-container">
                      <p>Loading...</p>
                  </div>
              ) : (
                  <Box sx={{ width: '100%', typography: 'body1' }}>
                      <TabContext value={value}>
                          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                              <TabList 
                                  onChange={handleChange} 
                                  sx={{ 
                                      position: 'fixed', 
                                      width: '100%', 
                                      bgcolor: 'background.paper', 
                                      zIndex: 1,
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                  }}
                              >
                                  <Tab label="Details" value="1" />
                                  <Tab label="Attendance" value="2" />
                                  <Tab label="Marks" value="3" />
                              </TabList>
                          </Box>
                          <Container sx={{ marginTop: "4rem", marginBottom: "4rem" }}>
                              <TabPanel value="1">
                                  <StudentDetailsSection />
                              </TabPanel>
                              <TabPanel value="2">
                                  <StudentAttendanceSection />
                              </TabPanel>
                              <TabPanel value="3">
                                  <StudentMarksSection />
                              </TabPanel>
                          </Container>
                      </TabContext>
                  </Box>
              )}
              <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
          </>
      )
  }

  export default ViewStudent

  const styles = {
      attendanceButton: {
          marginLeft: "20px",
          backgroundColor: "#1976d2",
          "&:hover": {
              backgroundColor: "#1565c0",
          }
      },
      styledButton: {
          margin: "20px",
          backgroundColor: "#2e7d32",
          "&:hover": {
              backgroundColor: "#1b5e20",
          }
      }
  }