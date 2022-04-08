import React, { useState, useContext } from 'react';
import LoginItemForm from './LoginItemForm';
import { UserContext } from '../services/userContext';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function AddLoginItemPopup () {
  const { setVault } = useContext(UserContext);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleExit = () => {
    setUrl('');
    setUsername('');
    setPassword('');
    handleClose();
  };

  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = () => {
    if (!url || !username || !password) {
      setError('Please fill all required fields');
    } else {
      setVault(prevState => [...prevState, { url, username, password }]);
      handleExit();
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add New Login Item
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Login Item</DialogTitle>
        <DialogContent>
          <LoginItemForm
            url={url}
            username={username}
            password={password}
            handleUrlChange={handleUrlChange}
            handleUsernameChange={handleUsernameChange}
            handlePasswordChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleExit}>Cancel</Button>
          <div>
            {error && (<span style={{ color: 'red' }}> {error} </span>)}
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
