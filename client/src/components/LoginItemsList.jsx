import React, { useContext } from 'react';

import { UserContext } from '../services/userContext';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
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

  return (
    <List>
      {Object.values(vault).map(({ url, username, password }, i) => (
        <ListItem
          key={i}
          secondaryAction={
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
          }
        >
          <ListItemText
            primary={url}
            secondary={username}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default LoginItemsList;
