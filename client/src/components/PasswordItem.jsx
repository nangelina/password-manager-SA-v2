import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function PasswordItem ({ label, value, onChange, isError, onBlur, readOnly }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <FormControl variant="outlined" fullWidth required>
        <InputLabel htmlFor={label}>{label}</InputLabel>
        <OutlinedInput
          type={showPassword ? 'text' : 'password'}
          placeholder={'Enter ' + label}
          value={value}
          disabled={readOnly}
          onChange={onChange}
          onBlur={onBlur}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={'toggle ' + label + ' visibility'}
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label={label}
          error={isError}
          helperText={isError ? 'Passwords must match' : ''}
        />
      </FormControl>
    </div>
  );
}

PasswordItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isError: PropTypes.bool,
  onBlur: PropTypes.func
};

export default PasswordItem;
