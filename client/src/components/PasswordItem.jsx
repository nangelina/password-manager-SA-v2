import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function PasswordItem ({ label, onChange, isError, onBlur }) {
  const camelCaseLabel = label.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');

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
        <InputLabel htmlFor={camelCaseLabel}>{label}</InputLabel>
        <OutlinedInput
          id={camelCaseLabel}
          type={showPassword ? 'text' : 'password'}
          placeholder={'Enter ' + label}
          onChange={onChange}
          onBlur={onBlur}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={'toggle ' + label + ' visibility'}
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                style={{
                  tabIndex: -1
                }}
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
  onChange: PropTypes.func.isRequired,
  isError: PropTypes.bool.isRequired,
  onBlur: PropTypes.func
};

export default PasswordItem;
