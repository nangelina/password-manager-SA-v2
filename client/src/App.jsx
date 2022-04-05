import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';

import { UserContext } from './services/userContext';

import CreateAccountPage from './pages/CreateAccountPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Crypto from './pages/Crypto';
import NotFoundPage from './pages/NotFoundPage';

import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';

let theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
});
theme = responsiveFontSizes(theme);

function App () {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    // this is going to double check that the user is still actually logged in
    // if the app is reloaded. it's possible that we still have a user in sessionStorage
    // but the user's session cookie expired.
    axios
      .get('/api/auth')
      .then((res) => {
        // if we get here, the user's session is still good. we'll update the user
        // to make sure we're using the most recent values just in case
        setUser(res.data);
      })
      .catch((err) => {
        // if we get a 401 response, that means the user is no longer logged in
        if (err.response.status === 401) {
          setUser(null);
        }
      });
  }, []);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create" element={<CreateAccountPage />} />
          <Route path="/cryptography-demo" element={<Crypto />} />
          <Route element={<NotFoundPage />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
