import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginButton from './LoginButton';
import LoginMenu from './LoginMenu';

import { update } from '../services/withUser';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Navbar ({ user }) {
  const navigate = useNavigate();
  const username = user ? user.username : null;

  const handleLogIn = () => {
    navigate('/login');
  };
  const handleLogOut = () => {
    axios
      .delete('/api/auth')
      .then(() => {
        // unsets the currently logged in user. all components wrapped in withUser
        // will be updated with a null user and rerender accordingly
        update(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            PassportJS Example
          </Typography>
          {user ? (
            <LoginMenu
              username={username}
              onLogOut={handleLogOut}
            />
          ) : (
            <LoginButton onClick={handleLogIn} />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
