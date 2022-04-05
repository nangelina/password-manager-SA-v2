import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function LoginButton () {
  const navigate = useNavigate();
  const handleLogIn = () => {
    navigate('/login');
  };

  return <Button color="secondary" onClick={handleLogIn}>Log In</Button>;
}

export default LoginButton;
