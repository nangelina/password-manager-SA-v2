import axios from 'axios';
import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';

import { withUser, update } from './services/withUser';

import CreateAccountPage from './pages/CreateAccountPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
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

class App extends Component {
    componentDidMount() {
        // this is going to double check that the user is still actually logged in
        // if the app is reloaded. it's possible that we still have a user in sessionStorage
        // but the user's session cookie expired.
        axios
            .get('/api/auth')
            .then((res) => {
                // if we get here, the user's session is still good. we'll update the user
                // to make sure we're using the most recent values just in case
                update(res.data);
            })
            .catch((err) => {
                // if we get a 401 response, that means the user is no longer logged in
                if (err.response.status === 401) {
                    update(null);
                }
            });
    }
    render() {
        const { user } = this.props;
        return (
            <Router>
                <ThemeProvider theme={theme}>
                    <Fragment>
                        <Navbar user={user} />
                        <Routes>
                            <Route exact path="/" component={HomePage} />
                            <Route exact path="/login" component={LoginPage} />
                            <Route
                                exact
                                path="/create"
                                component={CreateAccountPage}
                            />
                            <Route component={NotFoundPage} />
                        </Routes>
                    </Fragment>
                </ThemeProvider>
            </Router>
        );
    }
}

export default withUser(App);
