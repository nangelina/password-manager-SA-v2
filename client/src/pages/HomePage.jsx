import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { UserContext } from '../services/userContext';

function HomePage () {
  const { user } = useContext(UserContext);
  const [stuff, setStuff] = useState(null);

  useEffect(() => {
    // only try loading stuff if the user is logged in.
    if (!user) {
      return;
    }

    axios
      .get('/api/stuff')
      .then((res) => {
        setStuff(res.data);
      })
      .catch((err) => {
        // if we got an error, we'll just log it and set stuff to an empty array
        console.log(err);
        setStuff([]);
      });
  }, []);

  return (
    <div>
      {user && stuff && (
        <div>
          Welcome back, {user.username}!
          <List>
            {stuff.map((s, i) => (
              <ListItem key={i}>{s}</ListItem>
            ))}
          </List>
        </div>
      )}
      {user && !stuff && <div>Hold on, looking for your stuff...</div>}
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
