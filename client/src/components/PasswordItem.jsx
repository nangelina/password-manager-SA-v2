import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

import checkPasswordPwnedCount from '../password/passwordChecker';
import PasswordGenerator from '../components/PasswordGenerator';

import PasswordStrengthBar from 'react-password-strength-bar';

import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import LoopIcon from '@mui/icons-material/Loop';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const MIN_LENGTH = 8;
const MAX_LENGTH = 64

function PasswordItem ({
  label,
  value = '',
  onChange,
  isError,
  onBlur,
  readOnly,
  isLogin,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [showGenerate, setShowGenerate] = useState(false);

  useEffect(() => {
    if (showGenerate) setShowPassword(true);
  }, [showGenerate]);

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

  useEffect(() => {
    getPwnCount(value);
  }, []);

  const error = useMemo(
    () => isError || Boolean(pwnCount),
    [isError, pwnCount]
  );
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
              {!readOnly && !isLogin && (
                <Tooltip
                  title={
                    showGenerate
                      ? 'Close Password Generator Options'
                      : 'Generate Password'
                  }
                  arrow
                >
                  <IconButton
                    aria-label={
                      (showGenerate ? 'show' : 'hide') +
                      ' password generation tab'
                    }
                    onClick={() =>
                      setShowGenerate(!showGenerate)
                    }
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showGenerate ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <LoopIcon />
                    )}
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={'Toggle ' + label + ' Visibility'} arrow>
              <IconButton
                aria-label={'toggle ' + label + ' visibility'}
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={handleMouseDownPassword}
              >
                  {showPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
              </IconButton>
              </Tooltip>
            </InputAdornment>
          }
          label={label}
          error={error}
        />
      </FormControl>
      {value && (
        <PasswordStrengthBar
          password={value}
          style={{ marginTop: '0.75em' }}
          minLength={MIN_LENGTH}
        />
      )}
      <Typography mt="0.5em" color="error">
        {errorText}
      </Typography>
      {showGenerate && (
        <PasswordGenerator
          showGenerate={showGenerate}
          onChange={onChange}
          minLength={MIN_LENGTH}
          maxLength={MAX_LENGTH}
        />
      )}
    </div>
  );
}

PasswordItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isError: PropTypes.bool,
  onBlur: PropTypes.func,
};

export default PasswordItem;
