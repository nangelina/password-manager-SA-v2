import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import FormItem from './FormItem.jsx';
import PasswordItem from './PasswordItem.jsx';

function HostedListingForm ({
  url,
  username,
  password,
  handleUrlChange,
  handleUsernameChange,
  handlePasswordChange,
}) {
  return (
    <div className="App">
      <Grid>
        <Card className="listing-form-container">
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormItem
                  label="URL"
                  value={url}
                  onChange={handleUrlChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormItem
                  label="Username"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </Grid>
              <Grid item xs={12}>
                <PasswordItem
                  label="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}

export default HostedListingForm;
