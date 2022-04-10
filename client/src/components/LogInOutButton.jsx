import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../services/userContext';

import Button from '@mui/material/Button';

function LogInOutButton () {
  const navigate = useNavigate();
  const { user, logOut } = useContext(UserContext);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogOut = () => {
    axios
      .delete('/api/auth')
      .then(() => {
        logOut();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Button
      color="secondary"
      onClick={user ? handleLogOut : handleLogin}
    >
      {`Log ${user ? 'Out' : 'In'}`}
    </Button>
  );
}

export default LogInOutButton;
