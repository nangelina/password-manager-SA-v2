import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import FormItem from './FormItem.jsx';
import PasswordItem from './PasswordItem.jsx';

function LoginItemForm ({
  url,
  username,
  password,
  handleUrlChange,
  handleUsernameChange,
  handlePasswordChange,
  readOnly
}) {
  return (
    <div className="App">
      <Grid>
        <Card className="listing-form-container">
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormItem
                  label="Website URL"
                  value={url}
                  onChange={handleUrlChange}
                  readOnly={readOnly}
                />
              </Grid>
              <Grid item xs={12}>
                <FormItem
                  label="Username"
                  value={username}
                  onChange={handleUsernameChange}
                  readOnly={readOnly}
                />
              </Grid>
              <Grid item xs={12}>
                <PasswordItem
                  label="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  readOnly={readOnly}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}

export default LoginItemForm;
