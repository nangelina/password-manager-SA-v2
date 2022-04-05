import React, { useContext } from 'react';
import LoginButton from './LoginButton';
import LoggedInMenu from './LoggedInMenu';

import { UserContext } from '../services/userContext';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Navbar () {
  const { user } = useContext(UserContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >
            PassportJS Example
          </Typography>
          {user
            ? <LoggedInMenu username={user.username} />
            : <LoginButton />}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
