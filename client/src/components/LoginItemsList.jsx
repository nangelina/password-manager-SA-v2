import React, { useContext, useState } from 'react';
import LoginItemPopup from './LoginItemPopup';

import { UserContext } from '../services/userContext';

import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
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

  const [open, setOpen] = useState(null);

  const handleClickOpen = (data) => {
    setOpen(data);
  };

  return (
    Object.keys(vault).length === 0
      ? <Typography m='1em'>
        You don&apos;t have any logins yet. Add a new one using the + button above.
      </Typography>
      :
      <div>
        {Boolean(open) && <LoginItemPopup
          open={Boolean(open)}
          setOpen={setOpen}
          initUrl={open.url}
          initUsername={open.username}
          initPassword={open.password}
          readOnly
        />}
        <List>
          {Object.values(vault).map(({ url, username, password }, i) => (
            <Tooltip key={i} title={`View Login Item - ${url}`} arrow>
              <ListItemButton>
                <ListItemText
                  primary={url}
                  secondary={username}
                  onClick={() => handleClickOpen({ url, username, password })}
                />
                <div>
                  <Tooltip title={`Launch URL - ${url}`}>
                    <IconButton
                      aria-label="launch URL"
                      onClick={() => launchURL(url)}
                    >
                      <LaunchIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Copy Username to Clipboard'>
                    <IconButton
                      aria-label="copy username"
                      onClick={() => copyToClipboard(username)}
                    >
                      <PersonIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Copy Password to Clipboard'>
                    <IconButton
                      aria-label="copy password"
                      onClick={() => copyToClipboard(password)}
                    >
                      <KeyIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </div>
  );
}

export default LoginItemsList;
