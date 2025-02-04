import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
  Container,
  IconButton,
  Chip
} from '@mui/material';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';

const SeeComplains = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector((state) => state.complain);
  const { currentUser } = useSelector(state => state.user)

  useEffect(() => {
    dispatch(getAllComplains(currentUser._id, "Complain"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Student Complaints
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      ) : response ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography variant="h6" color="textSecondary">
            No Complaints Right Now
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {complainsList && complainsList.map((complain) => (
            <Grid item xs={12} key={complain._id}>
              <Card sx={{ 
                '&:hover': { 
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {complain.user.name}
                    </Typography>
                    <Box>
                      <Chip 
                        label={new Date(complain.date).toLocaleDateString()}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <FlagIcon color="error" sx={{ mt: 0.5 }} />
                    <Typography variant="body1" color="text.secondary">
                      {complain.complaint}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SeeComplains;