import axios from 'axios';
import React, { useEffect, useContext, useState } from 'react';

import { UserContext } from '../services/userContext';
import LoginItemPopup from '../components/LoginItemPopup';
import LoginItemsList from '../components/LoginItemsList';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';

function HomePage () {
  // Vault Login Items

  const { user, setUser, logOut, vault } = useContext(UserContext);
  const [sessionExpired, setSessionExpired] = useState(false);

  async function getVault () {
    // only try loading stuff if the user is logged in.
    if (!user) {
      return;
    }

    return axios
      .get('/api/stuff')
      .then((res) => {
        setUser((prevState) => ({ ...prevState, ...res.data }));
        setSessionExpired(false);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          logOut();
          setSessionExpired(true);
        } else {
          console.error(err);
        }
      });
  }

  useEffect(getVault, []);

  // Add New Login Item Popup

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      {user
        ? (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '2em 1em 0',
            }}
            >
              <Typography variant='h4'>
                {`${user.username}'s Password Vault`}
              </Typography>
              <div>
                <IconButton onClick={getVault} color='primary'>
                  <RefreshIcon />
                </IconButton>
                <IconButton onClick={handleClickOpen} color='primary'>
                  <AddIcon />
                </IconButton>
              </div>
            </div>
            {user.vault
              ? <Typography color='error' m='1em'>
                An error occurred. Please log out and log back in.
              </Typography>
              : <LoginItemsList />
            }
            <LoginItemPopup open={open} setOpen={setOpen} />
          </div>
        )
        : (
          <Typography m='1em'>
            {sessionExpired
              ? 'Session expired due to inactivity. Please log back in.'
              : 'Log in or register using the link above.'}
          </Typography>
        )}
    </div>
  );
}

export default HomePage;
