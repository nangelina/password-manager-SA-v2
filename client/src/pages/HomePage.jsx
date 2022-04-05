import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';

import { UserContext } from '../services/userContext';
import AddPasswordPopup from '../components/AddPasswordPopup'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

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
        setUser({ ...user, ...res.data });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(getVault, []);

  return (
    <div>
      {JSON.stringify(user)}
      {user && (
        <div>
          {vault ? (
            <div>
              Welcome back, {user.username}!
              <List>
                {/* {vault.map((s, i) => (
                  <ListItem key={i}>{s}</ListItem>
                ))} */}
                {JSON.stringify(vault)}
              </List>
            </div>
          )
            : (<div>Hold on, looking for your stuff...</div>)
          }
          <Button onClick={getVault}>Refresh</Button>
          <AddPasswordPopup />
        </div>
      )
      }
      {!user && (
        <div>
          Hey! I don't recognize you! Register and log in using the
          link above
        </div>
      )}
    </div>
  );
}

export default HomePage;
