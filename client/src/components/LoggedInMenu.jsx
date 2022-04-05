import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../services/userContext';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function LoggedInMenu ({ username, ...otherProps }) {
  const navigate = useNavigate()
  const { setUser } = useContext(UserContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    axios
      .delete('/api/auth')
      .then(() => {
        // unsets the currently logged in user
        setUser(null);
      })
      .catch((err) => {
        console.log(err);
        handleClose();
      });
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          ...otherProps,
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => {
          navigate('/');
          handleClose();
        }}>My Passwords</MenuItem>
        <MenuItem onClick={() => {
          navigate('/cryptography-demo');
          handleClose();
        }}>Cryptography Demo</MenuItem>
        <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
      </Menu>
    </div>
  );
};

export default LoggedInMenu;
