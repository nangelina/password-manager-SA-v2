import React, { useContext, useState } from 'react';
import LoginItemPopup from './LoginItemPopup';

import { UserContext } from '../services/userContext';

import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import LaunchIcon from '@mui/icons-material/Launch';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';

function LoginItemsList () {
  const { vault } = useContext(UserContext);

  function launchURL (url) {
    if (!url.includes('http')) url = 'http://' + url;
    window.open(url, "_blank");
  }

  function copyToClipboard (text) {
    navigator.clipboard.writeText(text);
  }

  // Login Item Details Popup

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    Object.keys(vault).length === 0
      ? <Typography>
        You don&apos;t have any logins yet. Add a new one using the button below.
      </Typography>
      :
      <List>
        {Object.values(vault).map(({ url, username, password }, i) => (
          <ListItemButton key={i}>
            <LoginItemPopup
              open={open}
              setOpen={setOpen}
              initUrl={url}
              initUsername={username}
              initPassword={password}
              readOnly
            />
            <ListItemText
              primary={url}
              secondary={username}
              onClick={handleClickOpen}
            />
            <div>
              <IconButton
                aria-label="launch URL"
                onClick={() => launchURL(url)}
              >
                <LaunchIcon />
              </IconButton>
              <IconButton
                aria-label="copy username"
                onClick={() => copyToClipboard(username)}
              >
                <PersonIcon />
              </IconButton>
              <IconButton
                aria-label="copy password"
                onClick={() => copyToClipboard(password)}
              >
                <KeyIcon />
              </IconButton>
            </div>
          </ListItemButton>
        ))}
      </List>
  );
}

export default LoginItemsList;
