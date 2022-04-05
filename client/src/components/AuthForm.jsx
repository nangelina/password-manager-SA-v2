import React from 'react';
import PropTypes from 'prop-types';
import FormItem from './FormItem.jsx';
import PasswordItem from './PasswordItem.jsx';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function AuthForm ({ isRegister }) {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
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
        setError(true);
        alert('Passwords must match.');
      } else {
        setError(false);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post('/api/users', { username: email, password })
      .then((user) => {
        // if the response is successful, make them log in
        if (isRegister) {
          navigate('/login');
        } else {
          setUser(user.data);
          navigate('/');
        }
      })
      .catch((err) => {
        setError(
          isRegister
            ? (err.response.data.message || err.message)
            : (err.response.status === 401
              ? 'Invalid username or password.'
              : err.message)
        );
      });
  };

  return (
    <div className="App">
      <Typography gutterBottom variant="h3" align="center">
        {isRegister ? 'Register' : 'Login'}
      </Typography>
      <Grid>
        <Card className="form-container">
          <CardContent>
            {!isRegister
              && <Typography gutterBottom variant="h5">
                Don't have an account yet? {<Link to="/register">Register</Link>} one first!
              </Typography>
            }
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormItem label="Email" type="email" onChange={handleEmailChange} />
                </Grid>
                <Grid item xs={12}>
                  <PasswordItem label="Password" onChange={handlePWChange} onBlur={validatePW} isError={error} />
                </Grid>
                {isRegister
                  ? <Grid item xs={12}>
                    <PasswordItem label="Confirm Password" onChange={handleConfirmPWChange} isError={error} onBlur={validatePW} />
                  </Grid>
                  : <></>
                }
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
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
