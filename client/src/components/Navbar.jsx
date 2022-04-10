import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import LoginButton from './LoginButton';
import LoggedInMenu from './LoggedInMenu';
import { UserContext } from '../services/userContext';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

function Navbar () {
  const navigate = useNavigate()
  const { user } = useContext(UserContext);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: 'flex' }}
          >
            Password Manager
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Button
              color="secondary"
              onClick={() => {
                navigate('/');
              }}
              sx={{ my: 2, display: 'block' }}
            >
              My Passwords
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                navigate('/cryptography-demo');
              }}
              sx={{ my: 2, display: 'block' }}
            >
              Cryptography Demo
            </Button>
          </Box>

          {user
            ? <LoggedInMenu username={user.username} />
            : <LoginButton />}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
