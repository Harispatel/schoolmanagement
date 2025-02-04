import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Typography, Paper, Grid, Box, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import SubjectIcon from '@mui/icons-material/Book';
// import LoadingSpinner from '../../../components/LoadingSpinner';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    if (error) {
        console.log(error);
    }

    const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

    const handleAddSubject = () => {
        navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
    };

    return (
        <>
            {/* {loading ? (
                <LoadingSpinner />
            ) : ( */}
                <Container maxWidth="md">
                    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
                        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                            <Typography variant="h4" component="h1" gutterBottom>
                                Teacher Profile
                            </Typography>
                            <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}>
                                {teacherDetails?.name?.charAt(0)}
                            </Avatar>
                        </Box>

                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <PersonIcon sx={{ fontSize: 30, mr: 2, color: 'primary.main' }} />
                                    <Typography variant="h6">
                                        Name: {teacherDetails?.name}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <ClassIcon sx={{ fontSize: 30, mr: 2, color: 'primary.main' }} />
                                    <Typography variant="h6">
                                        Class: {teacherDetails?.teachSclass?.sclassName}
                                    </Typography>
                                </Box>
                            </Grid>

                            {isSubjectNamePresent ? (
                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <SubjectIcon sx={{ fontSize: 30, mr: 2, color: 'primary.main' }} />
                                        <Box>
                                            <Typography variant="h6">
                                                Subject: {teacherDetails?.teachSubject?.subName}
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                Sessions: {teacherDetails?.teachSubject?.sessions}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ) : (
                                <Grid item xs={12}>
                                    <Button 
                                        variant="contained" 
                                        onClick={handleAddSubject}
                                        size="large"
                                        sx={{ 
                                            mt: 2,
                                            borderRadius: 2,
                                            padding: '12px 24px',
                                            textTransform: 'none'
                                        }}
                                    >
                                        Add Subject
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Container>
            {/* )} */}
        </>
    );
};

export default TeacherDetails;