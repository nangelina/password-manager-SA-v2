import React from "react";
import { render } from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import UserProvider from './services/userContext';
import CssBaseline from '@mui/material/CssBaseline';

render(
    <UserProvider>
        <CssBaseline />
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </UserProvider>,
    document.getElementById('root')
);

registerServiceWorker();
