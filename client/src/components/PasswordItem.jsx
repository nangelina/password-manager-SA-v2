import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import checkPasswordPwnedCount from '../password/passwordChecker'

import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function PasswordItem ({ label, value = '', onChange, isError, onBlur, readOnly }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [pwnCount, setPwnCount] = useState(0);

  const getPwnCount = async (password) => {
    checkPasswordPwnedCount(password).then((count) => {
      setPwnCount(count);
    });
  };

  const handleOnChange = async (event) => {
    onChange(event);
    getPwnCount(event.target.value);
  };

  React.useEffect(() => {
    console.log('getPwnCount');
    getPwnCount(value);
  }, []);

  const error = useMemo(() => isError || Boolean(pwnCount), [isError, pwnCount]);
  const errorText = useMemo(() => {
    if (!isError && pwnCount) {
      return `Password found in ${pwnCount.toLocaleString()} breaches. It is recommended to change it.`;
    } else {
      return '';
    }
  }, [isError, pwnCount]);

  return (
    <div>
      <FormControl variant="outlined" fullWidth required>
        <InputLabel htmlFor={label}>{label}</InputLabel>
        <OutlinedInput
          type={showPassword ? 'text' : 'password'}
          placeholder={'Enter ' + label}
          value={value}
          disabled={readOnly}
          onChange={handleOnChange}
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
          error={error}
        />
      </FormControl>
      <Typography mt='0.5em' color='error'>{errorText}</Typography>
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
