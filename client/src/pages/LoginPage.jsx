import axios from 'axios';
import React, { useState } from 'react';
// import { Grid, Row, Col } from 'react-flexbox-grid';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { update } from '../services/withUser';

function LoginPage (props) {
  const navigate = useNavigate();
  const [state, setState] = useState({
    username: null,
    password: null,
  });
  const handleInputChanged = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  const handleLogin = (event) => {
    event.preventDefault();

    const { username, password } = this.state;

    // post an auth request
    axios
      .post('/api/auth', {
        username,
        password,
      })
      .then((user) => {
        // if the response is successful, update the current user and redirect to the home page
        update(user.data);
        navigate('/');
      })
      .catch((err) => {
        // an error occured, so let's record the error in our state so we can display it in render
        // if the error response status code is 401, it's an invalid username or password.
        // if it's any other status code, there's some other unhandled error so we'll just show
        // the generic message.
        this.setState({
          error:
            err.response.status === 401
              ? 'Invalid username or password.'
              : err.message,
        });
      });
  };

  const { error } = this.state;

  return (
    // <Grid fluid>
    //     <Row>
    //         <Col xs={6} xsOffset={3}>
    <form onSubmit={this.handleLogin}>
      <h1>Log In</h1>
      {error && <div>{error}</div>}
      <div>
        <TextField
          name="username"
          hintText="Username"
          floatingLabelText="Username"
          onChange={this.handleInputChanged}
        />
      </div>
      <div>
        <TextField
          name="password"
          hintText="Password"
          floatingLabelText="Password"
          type="password"
          onChange={this.handleInputChanged}
        />
      </div>
      <div>
        <Button primary type="submit">
          Log In
        </Button>
      </div>
      <p>or</p>
      <p>
        <Link to="/create">Register</Link>
      </p>
    </form>
    //         </Col>
    //     </Row>
    // </Grid>
  );
}

export default LoginPage;
