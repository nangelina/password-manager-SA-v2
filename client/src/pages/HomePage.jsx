import axios from 'axios';
import React, { useEffect, useContext } from 'react';

import { UserContext } from '../services/userContext';
import AddPasswordPopup from '../components/AddLoginItemPopup';

import Button from '@mui/material/Button';
import LoginItemsList from '../components/LoginItemsList';

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
