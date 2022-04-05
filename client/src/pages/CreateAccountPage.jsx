import axios from 'axios';
import React, { useState } from 'react';
// import { Grid, Row, Col } from 'react-flexbox-grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
function CreateAccountPage(props) {
    const navigate = useNavigate();
    const [state, setState] = useState({
        username: null,
        password: null,
        error: null,
    });
    const handleInputChanged = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };
    const handleLogin = (event) => {
        event.preventDefault();

        const { username, password } = state;

        // clear any previous errors so we don't confuse the user
        setState({
            error: null,
        });

        // check to make sure they've entered a username and password.
        // this is very poor validation, and there are better ways
        // to do this in react, but this will suffice for the example
        if (!username || !password) {
            setState({
                error: 'A username and password is required.',
            });
            return;
        }

        // post an auth request
        axios
            .post('/api/users', {
                username,
                password,
            })
            .then((user) => {
                // if the response is successful, make them log in
                navigate('/login');
            })
            .catch((err) => {
                setState({
                    error: err.response.data.message || err.message,
                });
            });
    };

    const { error } = state;

    return (
        // <Grid fluid>
        //     <Row>
        //         <Col xs={6} xsOffset={3}>
        <form onSubmit={handleLogin}>
            <h1>Create Account</h1>
            {error && <div>{error}</div>}
            <div>
                <TextField
                    name="username"
                    hintText="Username"
                    floatingLabelText="Username"
                    onChange={handleInputChanged}
                />
            </div>
            <div>
                <TextField
                    name="password"
                    hintText="Password"
                    floatingLabelText="Password"
                    type="password"
                    onChange={handleInputChanged}
                />
            </div>
            <div>
                <Button primary type="submit">
                    Create Account
                </Button>
            </div>
        </form>
        //         </Col>
        //     </Row>
        // </Grid>
    );
}

export default CreateAccountPage;
