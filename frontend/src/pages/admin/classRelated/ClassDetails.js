import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClassDetails,
  getClassStudents,
  getSubjectList,
} from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import Popup from "../../../components/Popup";

const ClassDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subjectsList, sclassStudents, sclassDetails, loading, error } =
    useSelector((state) => state.sclass);

  const classID = params.id;

  useEffect(() => {
    dispatch(getClassDetails(classID, "Sclass"));
    dispatch(getSubjectList(classID, "ClassSubjects"));
    dispatch(getClassStudents(classID));
  }, [dispatch, classID]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const DashboardCard = ({ title, count, icon, color, action }) => {
    return (
      <Card sx={{ height: "100%", backgroundColor: color, color: "white" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {icon}
            <Typography variant="h4">{count}</Typography>
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>
            {title}
          </Typography>
        </CardContent>
        <CardActions>
          <BlueButton size="small" onClick={action} sx={{ color: "white" }}>
            Back to Dashboard
          </BlueButton>
        </CardActions>
      </Card>
    );
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom component="div" sx={{ mb: 4 }}>
            Class {sclassDetails && sclassDetails.sclassName} Dashboard
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <DashboardCard
                title="Total Students"
                count={sclassStudents.length}
                icon={<PeopleIcon sx={{ fontSize: 40 }} />}
                color="#1976d2"
                action={() => navigate(`/Admin/class/${classID}/students`)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DashboardCard
                title="Total Subjects"
                count={subjectsList.length}
                icon={<MenuBookIcon sx={{ fontSize: 40 }} />}
                color="#2e7d32"
                action={() => navigate(`/Admin/class/${classID}/subjects`)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DashboardCard
                title="Class Performance"
                // count="View"
                icon={<SchoolIcon sx={{ fontSize: 40 }} />}
                color="#ed6c02"
                action={() => navigate(`/Admin/class/${classID}/performance`)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Quick Actions</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <GreenButton
                      fullWidth
                      variant="contained"
                      startIcon={<PersonAddAlt1Icon />}
                      onClick={() =>
                        navigate("/Admin/class/addstudents/" + classID)
                      }
                    >
                      Add Student
                    </GreenButton>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <GreenButton
                      fullWidth
                      variant="contained"
                      startIcon={<PostAddIcon />}
                      onClick={() => navigate("/Admin/addsubject/" + classID)}
                    >
                      Add Subject
                    </GreenButton>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" gutterBottom>
                  Class Information
                </Typography>
                <Typography variant="body1">
                  Class Name: {sclassDetails && sclassDetails.sclassName}
                </Typography>
                <Typography variant="body1">
                  Academic Year: {new Date().getFullYear()}-
                  {new Date().getFullYear() + 1}
                </Typography>
                <Typography variant="body1">
                  Class Teacher: Not Assigned
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default ClassDetails;
