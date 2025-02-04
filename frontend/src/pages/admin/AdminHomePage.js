import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector(state => state.user);
    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    const StatCard = ({ image, title, count, duration, prefix }) => (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: 200,
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                },
            }}
        >
            <Box
                component="img"
                src={image}
                alt={title}
                sx={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '80px',
                    mb: 2
                }}
            />
            <Typography variant="h6" component="h2" gutterBottom>
                {title}
            </Typography>
            <Typography
                variant="h4"
                component="div"
                sx={{ color: 'success.main', fontWeight: 'bold' }}
            >
                <CountUp start={0} end={count} duration={duration} prefix={prefix} />
            </Typography>
        </Paper>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        image={Students}
                        title="Total Students"
                        count={numberOfStudents}
                        duration={2.5}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        image={Classes}
                        title="Total Classes"
                        count={numberOfClasses}
                        duration={5}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        image={Teachers}
                        title="Total Teachers"
                        count={numberOfTeachers}
                        duration={2.5}
                    />
                </Grid>
                {/* <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        image={Fees}
                        title="Fees Collection"
                        count={23000}
                        duration={2.5}
                        prefix="$"
                    />
                </Grid> */}
                <Grid item xs={12}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 2
                        }}
                    >
                        <SeeNotice />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminHomePage;