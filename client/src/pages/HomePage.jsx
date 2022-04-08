import axios from 'axios';
import React, { useEffect, useContext, useState } from 'react';

import { UserContext } from '../services/userContext';
import AddPasswordPopup from '../components/AddLoginItemPopup';

import Button from '@mui/material/Button';
import LoginItemsList from '../components/LoginItemsList';

function HomePage () {
  const { user, setUser, logOut, vault } = useContext(UserContext);
  const [sessionExpired, setSessionExpired] = useState(false)

  async function getVault () {
    // only try loading stuff if the user is logged in.
    if (!user) {
      return;
    }

    return axios
      .get('/api/stuff')
      .then((res) => {
        console.log('got vault', res.data);
        setUser((prevState) => ({ ...prevState, ...res.data }));
        setSessionExpired(false)
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

  return (
    <div>
      {user && (
        <div>
          {vault ? (
            <div>
              Welcome back, {user.username}!
              <LoginItemsList />
            </div>
          ) : (
            <div>Hold on, looking for your stuff...</div>
          )}
          <Button onClick={getVault}>Refresh</Button>
          <AddPasswordPopup />
        </div>
      )}
      {!user && (<div>
        {sessionExpired
          ? 'Session expired due to inactivity. Please log back in.'
          : 'Log in or register using the link above.'}
        </div>
      )}
    </div>
  );
}

export default HomePage;
