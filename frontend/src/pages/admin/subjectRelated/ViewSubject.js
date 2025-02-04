import React, { useEffect, useState } from 'react'
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Container, Typography, BottomNavigation, BottomNavigationAction, Paper, Card, CardContent, Grid, Divider } from '@mui/material';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import SubjectIcon from '@mui/icons-material/Subject';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import CodeIcon from '@mui/icons-material/Code';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';

const ViewSubject = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

  const { classID, subjectID } = params

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  if (error) {
    console.log(error)
  }

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState('attendance');
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const studentColumns = [
    { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
  ]

  const studentRows = sclassStudents.map((student) => {
    return {
      rollNum: student.rollNum,
      name: student.name,
      id: student._id,
    };
  })

  const StudentsAttendanceButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)
          }
        >
          Take Attendance
        </PurpleButton>
      </>
    );
  };

  const StudentsMarksButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton variant="contained"
          onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}>
          Provide Marks
        </PurpleButton>
      </>
    );
  };

  const SubjectStudentsSection = () => {
    return (
      <>
        {getresponse ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
              >
                Add Students
              </GreenButton>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Students List:
            </Typography>

            {selectedSection === 'attendance' &&
              <TableTemplate buttonHaver={StudentsAttendanceButtonHaver} columns={studentColumns} rows={studentRows} />
            }
            {selectedSection === 'marks' &&
              <TableTemplate buttonHaver={StudentsMarksButtonHaver} columns={studentColumns} rows={studentRows} />
            }

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                <BottomNavigationAction
                  label="Attendance"
                  value="attendance"
                  icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                />
                <BottomNavigationAction
                  label="Marks"
                  value="marks"
                  icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                />
              </BottomNavigation>
            </Paper>
          </>
        )}
      </>
    )
  }

  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;

    return (
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
          Subject Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SubjectIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Subject Name: {subjectDetails && subjectDetails.subName}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CodeIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Subject Code: {subjectDetails && subjectDetails.subCode}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Sessions: {subjectDetails && subjectDetails.sessions}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GroupIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Number of Students: {numberOfStudents}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ClassIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Class: {subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                  {subjectDetails && subjectDetails.teacher ? (
                    <Typography variant="h6">
                      Teacher: {subjectDetails.teacher.name}
                    </Typography>
                  ) : (
                    <GreenButton variant="contained"
                      onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}>
                      Add Subject Teacher
                    </GreenButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <>
      {subloading ?
        <div>Loading...</div>
        :
        <>
          <Box sx={{ width: '100%', typography: 'body1', }} >
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                  <Tab label="Details" value="1" />
                  <Tab label="Students" value="2" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <SubjectDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <SubjectStudentsSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      }
    </>
  )
}

export default ViewSubject