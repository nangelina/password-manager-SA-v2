import React, { useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';

import FormItem from './FormItem.jsx';
import PasswordItem from './PasswordItem.jsx';
import { UserContext } from '../services/userContext';
import { generateMasterKey, stretchMasterKey, generateMasterKeyHash, generateSymKey, encryptSymKey } from '../crypto/cryptoAppHelpers';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function AuthForm ({ isRegister }) {
  const navigate = useNavigate();
  const { setUser, setStretchedMasterKey } = useContext(UserContext);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handlePWChange = (event) => {
    setPassword(event.target.value);
  };
  const handleConfirmPWChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const validatePW = () => {
    if (password !== '' && confirmPassword !== '') {
      if (password !== confirmPassword) {
        setError('Passwords must match.');
      } else {
        setError(false);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const masterKey = await generateMasterKey(username, password);
    const masterPasswordHash = await generateMasterKeyHash(masterKey, password);
    const stretchedMasterKey = await stretchMasterKey(masterKey);

    if (isRegister) {
      const unencryptedSymKey = generateSymKey();
      const encryptedSymKey = await encryptSymKey(unencryptedSymKey, stretchedMasterKey);

      axios
        .post('/api/users', {
          username,
          password: masterPasswordHash.b64,
          symKey: encryptedSymKey.string
        })
        .then((user) => {
          // if the response is successful, make them log in
          navigate('/login');
        })
        .catch((err) => {
          setError(err.response.data.message || err.message);
        });
    } else {
      axios
        .post('/api/auth', {
          username,
          password: masterPasswordHash.b64,
        })
        .then((user) => {
          // if the response is successful, update the current user and redirect to the home page
          setUser(user.data);
          setStretchedMasterKey(stretchedMasterKey)
          navigate('/');
        })
        .catch((err) => {
          setError(
            err.response && err.response.status === 401
              ? 'Invalid username or password.'
              : err.message
          );
        });
    }
  };

  return (
    <div className="App">
      <Typography gutterBottom variant="h3" align="center">
        {isRegister ? 'Register' : 'Login'}
      </Typography>
      <Grid>
        <Card className="form-container">
          <CardContent>
            {!isRegister && (
              <Typography gutterBottom variant="h5">
                Don&apos;t have an account yet?{' '}
                {<Link to="/register">Register</Link>} one
                first!
              </Typography>
            )}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormItem
                    label="Username"
                    onChange={handleUsernameChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <PasswordItem
                    label="Password"
                    value={password}
                    onChange={handlePWChange}
                    onBlur={validatePW}
                    isError={Boolean(error)}
                  />
                </Grid>
                {isRegister && (
                  <Grid item xs={12}>
                    <PasswordItem
                      label="Confirm Password"
                      value={confirmPassword}
                      onChange={handleConfirmPWChange}
                      isError={Boolean(error)}
                      onBlur={validatePW}
                    />
                  </Grid>
                )}
                {error && (
                  <Grid item xs={12} style={{ color: 'red' }}>
                    {error}
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    {isRegister ? 'Sign Up' : 'Sign In'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}

AuthForm.propTypes = {
  isRegister: PropTypes.bool.isRequired,
};

export default AuthForm;
