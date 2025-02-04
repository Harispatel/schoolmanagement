import React, { useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, updateUser } from '../../redux/userRelated/userHandle';
import { useNavigate } from 'react-router-dom';
import { authLogout } from '../../redux/userRelated/userSlice';
import { Button, Collapse, Paper, Container, Typography, Box, TextField, Avatar } from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';

const AdminProfile = () => {
    const [showTab, setShowTab] = useState(false);
    const buttonText = showTab ? 'Cancel' : 'Edit Profile';

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState("");
    const [schoolName, setSchoolName] = useState(currentUser.schoolName);

    const fields = password === "" ? { name, email, schoolName } : { name, email, password, schoolName };

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(updateUser(fields, currentUser._id, "Admin"));
    };

    const deleteHandler = () => {
        try {
            dispatch(deleteUser(currentUser._id, "Students"));
            dispatch(deleteUser(currentUser._id, "Admin"));
            dispatch(authLogout());
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
            <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <AdminPanelSettings fontSize="large" />
                </Avatar>
                
                <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
                    Admin Profile
                </Typography>

                <Box sx={{ width: '100%', mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Name: {currentUser.name}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Email: {currentUser.email}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        School: {currentUser.schoolName}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* <Button variant="contained" color="error" onClick={deleteHandler}>
                        Delete Account
                    </Button> */}
                    <Button 
                        variant="contained" 
                        onClick={() => setShowTab(!showTab)}
                        endIcon={showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    >
                        {buttonText}
                    </Button>
                </Box>

                <Collapse in={showTab} timeout="auto" unmountOnExit sx={{ width: '100%', mt: 3 }}>
                    <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="School Name"
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            autoComplete="organization"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Update Profile
                        </Button>
                    </Box>
                </Collapse>
            </Paper>
        </Container>
    );
};

export default AdminProfile;