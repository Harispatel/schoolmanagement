import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';
import { Box, Typography, Button, Paper } from '@mui/material';

const Logout = () => {
  const currentUser = useSelector(state => state.user.currentUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
      dispatch(authLogout());
      navigate('/');
  };

  const handleCancel = () => {
      navigate(-1);
  };

  return (
      <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
      >
          <Paper
              elevation={3}
              sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'rgba(133, 118, 159, 0.4)',
                  borderRadius: 2,
                  maxWidth: 400,
                  width: '100%'
              }}
          >
              <Typography variant="h5" component="h1" gutterBottom>
                  {currentUser.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                  Are you sure you want to log out?
              </Typography>
              <Button
                  variant="contained"
                  onClick={handleLogout}
                  sx={{
                      mb: 2,
                      backgroundColor: '#ea0606',
                      '&:hover': {
                          backgroundColor: '#c50505'
                      }
                  }}
              >
                  Log Out
              </Button>
              <Button
                  variant="contained"
                  onClick={handleCancel}
                  sx={{
                      backgroundColor: 'rgb(99, 60, 99)',
                      '&:hover': {
                          backgroundColor: 'rgb(79, 48, 79)'
                      }
                  }}
              >
                  Cancel
              </Button>
          </Paper>
      </Box>
  );
};

export default Logout;