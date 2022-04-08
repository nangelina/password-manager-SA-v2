import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';

function FormItem ({ label, type, value, onChange, readOnly }) {
  return (
    <TextField
      type={type}
      label={label}
      value={value}
      placeholder={value ? '' : `Enter ${label}`}
      onChange={onChange}
      disabled={readOnly}
      variant="outlined"
      fullWidth
      required
    />
  );
}

FormItem.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

FormItem.defaultProps = {
  type: 'text',
  value: null
};

export default FormItem;
