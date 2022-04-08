import React, { useState, useContext } from 'react';
import LoginItemForm from './LoginItemForm';
import { UserContext } from '../services/userContext';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function LoginItemPopup ({
  open,
  setOpen,
  initUrl = '',
  initUsername = '',
  initPassword = '',
  readOnly
}) {
  const { setVault } = useContext(UserContext);

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleExit = () => {
    handleClose();
    setUrl(initUrl);
    setUsername(initUsername);
    setPassword(initPassword);
    setView(readOnly);
  };

  const [url, setUrl] = useState(initUrl);
  const [username, setUsername] = useState(initUsername);
  const [password, setPassword] = useState(initPassword);
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
      setVault((prevState) => {
        const newState = { ...prevState };
        delete newState[`${initUrl}|${initUsername}`];
        return { ...newState, [`${url}|${username}`]: { url, username, password } };
      })
      handleExit();
    }
  };

  const [view, setView] = useState(readOnly);
  function toggleReadOnly () {
    setView(prevState => !prevState);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {view
          ? <div>
            View Form Item
            <Button onClick={toggleReadOnly}>Edit</Button>
          </div>
          : `${initUrl ? 'Edit' : 'Add New'} Form Item`
        }
      </DialogTitle>
      <DialogContent>
        <LoginItemForm
          url={url}
          username={username}
          password={password}
          handleUrlChange={handleUrlChange}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          readOnly={view}
        />
      </DialogContent>
      <DialogActions
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Button onClick={handleExit}>Cancel</Button>
        <div>
          {error && <span style={{ color: 'red' }}> {error} </span>}
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
