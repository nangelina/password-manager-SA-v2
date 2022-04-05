import React, { useState, useContext } from 'react';
import HostedListingForm from './hosted-listings/HostedListingForm';
import { UserContext } from '../services/userContext';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog () {
  const { addVaultItem } = useContext(UserContext);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    try {
      addVaultItem({ url, username, password });
    } catch (error) {
      setError(error);
    }
    handleClose();
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Login Item</DialogTitle>
        <DialogContent>
          <HostedListingForm
            url={url}
            username={username}
            password={password}
            handleUrlChange={handleUrlChange}
            handleUsernameChange={handleUsernameChange}
            handlePasswordChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions>
          {error && (<span style={{ color: 'red' }}> {error} </span>)}
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
