import axios from 'axios';
import React, { useEffect, useContext } from 'react';

import { UserContext } from '../services/userContext';
import AddPasswordPopup from '../components/AddPasswordPopup';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function HomePage () {
  const { user, setUser, vault } = useContext(UserContext);

  async function getVault () {
    // only try loading stuff if the user is logged in.
    if (!user) {
      return;
    }

    return axios
      .get('/api/stuff')
      .then((res) => {
        setUser((prevState) => ({ ...prevState, ...res.data }));
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(getVault, []);

  return (
    <div>
      {JSON.stringify(user, null, 2)}
      {user && (
        <div>
          {vault ? (
            <div>
              Welcome back, {user.username}!
              <List>
                {vault.map((loginDetails, i) => (
                  <ListItem
                    key={i}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={loginDetails.url}
                      secondary={loginDetails.username}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          ) : (
            <div>Hold on, looking for your stuff...</div>
          )}
          <Button onClick={getVault}>Refresh</Button>
          <AddPasswordPopup />
        </div>
      )}
      {!user && (
        <div>
          Hey! I don&apos;t recognize you! Register and log in using the
          link above
        </div>
      )}
    </div>
  );
}

export default HomePage;
