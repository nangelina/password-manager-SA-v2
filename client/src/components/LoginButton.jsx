import React from 'react';
import Button from '@mui/material/Button';

function LoginButton ({ onClick }) {
  return <Button onClick={onClick}>Log In</Button>;
}

export default LoginButton;
