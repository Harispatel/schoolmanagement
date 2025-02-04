import { useEffect, useState } from 'react';
import { IconButton, Box, Menu, MenuItem, ListItemIcon, Tooltip, Button, CircularProgress, Container, Typography, Paper } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import TableTemplate from '../../../components/TableTemplate';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import Popup from '../../../components/Popup';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';

const ShowClasses = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector(state => state.user)

  const adminID = currentUser._id

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error)
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    setMessage("Sorry the delete function has been disabled for now.")
    setShowPopup(true)
    // dispatch(deleteUser(deleteID, address))
    //   .then(() => {
    //     dispatch(getAllSclasses(adminID, "Sclass"));
    //   })
  }

  const sclassColumns = [
    { id: 'name', label: 'Class Name', minWidth: 170 },
  ]

  const sclassRows = sclassesList && sclassesList.length > 0 && sclassesList.map((sclass) => {
    return {
      name: sclass.sclassName,
      id: sclass._id,
    };
  })

  const SclassButtonHaver = ({ row }) => {
    const actions = [
      { icon: <PostAddIcon />, name: 'Add Subjects', action: () => navigate("/Admin/addsubject/" + row.id) },
      { icon: <PersonAddAlt1Icon />, name: 'Add Student', action: () => navigate("/Admin/class/addstudents/" + row.id) },
    ];
    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
        <IconButton onClick={() => deleteHandler(row.id, "Sclass")} size="small">
          <DeleteIcon color="error" />
        </IconButton>
        <Button variant="contained" color="primary" size="small"
          onClick={() => navigate("/Admin/classes/class/" + row.id)}>
          View
        </Button>
        <ActionMenu actions={actions} />
      </Box>
    );
  };

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title="Add Students & Subjects">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Typography variant="button">Add</Typography>
              <SpeedDialIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {actions.map((action, index) => (
            <MenuItem key={index} onClick={action.action}>
              <ListItemIcon>{action.icon}</ListItemIcon>
              {action.name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  const actions = [
    {
      icon: <AddCardIcon color="primary" />, 
      name: 'Add New Class',
      action: () => navigate("/Admin/addclass")
    },
    {
      icon: <DeleteIcon color="error" />, 
      name: 'Delete All Classes',
      action: () => deleteHandler(adminID, "Sclasses")
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium', mb: 4 }}>
          Manage Classes
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {getresponse ? (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="success" 
                  onClick={() => navigate("/Admin/addclass")}
                  sx={{ borderRadius: 2 }}
                >
                  Add Class
                </Button>
              </Box>
            ) : (
              <>
                {Array.isArray(sclassesList) && sclassesList.length > 0 && (
                  <TableTemplate 
                    buttonHaver={SclassButtonHaver} 
                    columns={sclassColumns} 
                    rows={sclassRows} 
                  />
                )}
                <SpeedDialTemplate actions={actions} />
              </>
            )}
          </>
        )}
        <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
      </Paper>
    </Container>
  );
};

export default ShowClasses;