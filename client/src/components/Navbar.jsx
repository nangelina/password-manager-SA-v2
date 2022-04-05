import axios from 'axios';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginButton from './LoginButton';
import LoginMenu from './LoginMenu';

import { UserContext } from '../services/userContext';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Navbar (props) {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const username = user ? user.username : null;

  const handleLogIn = () => {
    navigate('/login');
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
      });
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="secondary" position="static">
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
}

export default Navbar;
