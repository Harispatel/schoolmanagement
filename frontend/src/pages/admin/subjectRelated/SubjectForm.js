import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, Box, Typography, CircularProgress, Paper, Container } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';

const SubjectForm = () => {
    const [subjects, setSubjects] = useState([{ subName: "", subCode: "", sessions: "" }]);

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;

    const sclassName = params.id
    const adminID = currentUser._id
    const address = "Subject"

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    const handleSubjectNameChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subName = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSubjectCodeChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subCode = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSessionsChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].sessions = event.target.value || 0;
        setSubjects(newSubjects);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subName: "", subCode: "" }]);
    };

    const handleRemoveSubject = (index) => () => {
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    const fields = {
        sclassName,
        subjects: subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
        })),
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/subjects");
            dispatch(underControl())
            setLoader(false)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={styles.formContainer}>
                <form onSubmit={submitHandler}>
                    <Box mb={4}>
                        <Typography variant="h5" color="primary" gutterBottom>
                            Add Subjects
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        {subjects.map((subject, index) => (
                            <React.Fragment key={index}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Subject Name"
                                        variant="outlined"
                                        value={subject.subName}
                                        onChange={handleSubjectNameChange(index)}
                                        sx={styles.inputField}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Subject Code"
                                        variant="outlined"
                                        value={subject.subCode}
                                        onChange={handleSubjectCodeChange(index)}
                                        sx={styles.inputField}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Sessions"
                                        variant="outlined"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={subject.sessions}
                                        onChange={handleSessionsChange(index)}
                                        sx={styles.inputField}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent={index === 0 ? "flex-start" : "flex-end"}>
                                        {index === 0 ? (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={handleAddSubject}
                                                sx={styles.actionButton}
                                            >
                                                Add Subject
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={handleRemoveSubject(index)}
                                                sx={styles.actionButton}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                            </React.Fragment>
                        ))}
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    type="submit" 
                                    disabled={loader}
                                    sx={styles.submitButton}
                                >
                                    {loader ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Save'
                                    )}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
                </form>
            </Paper>
        </Container>
    );
}

export default SubjectForm

const styles = {
    formContainer: {
        padding: 4,
        marginTop: 4,
        marginBottom: 4,
    },
    inputField: {
        '& .MuiInputLabel-root': {
            color: '#838080',
        },
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
                borderColor: 'primary.main',
            },
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#838080',
        },
    },
    actionButton: {
        margin: 1,
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 'bold',
    },
    submitButton: {
        padding: '10px 30px',
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 'bold',
    },
};