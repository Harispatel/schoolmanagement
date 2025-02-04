import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotices } from '../redux/noticeRelated/noticeHandle';
import { Paper, Container, Typography, Box, CircularProgress } from '@mui/material';
import TableViewTemplate from './TableViewTemplate';

const SeeNotice = () => {
    const dispatch = useDispatch();

    const { currentUser, currentRole } = useSelector(state => state.user);
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);

    useEffect(() => {
        if (currentRole === "Admin") {
            dispatch(getAllNotices(currentUser._id, "Notice"));
        }
        else {
            dispatch(getAllNotices(currentUser.school._id, "Notice"));
        }
    }, [dispatch]);

    if (error) {
        console.log(error);
    }

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

    const noticeRows = noticesList.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
    });

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 5 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                        <CircularProgress />
                    </Box>
                ) : response ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                        <Typography variant="h6" color="textSecondary">
                            No Notices to Show Right Now
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                            Notices
                        </Typography>
                        <Paper 
                            elevation={3}
                            sx={{ 
                                width: '100%', 
                                overflow: 'hidden',
                                borderRadius: 2,
                                '& .MuiTableContainer-root': {
                                    maxHeight: {
                                        xs: '50vh',
                                        sm: '60vh',
                                        md: '70vh'
                                    }
                                }
                            }}
                        >
                            {Array.isArray(noticesList) && noticesList.length > 0 &&
                                <TableViewTemplate columns={noticeColumns} rows={noticeRows} />
                            }
                        </Paper>
                    </>
                )}
            </Box>
        </Container>
    )
}

export default SeeNotice