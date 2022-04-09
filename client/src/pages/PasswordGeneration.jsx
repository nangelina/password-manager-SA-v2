import React, { useState } from 'react';
import PasswordGenerator from '../components/PasswordGenerator';
import PasswordItem from '../components/PasswordItem';

function PasswordGeneration () {
  const [password, setPassword] = useState('');
  return (
    <div>
      <PasswordItem
        label="Generated Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        readOnly
      />
    </div>
  );
}

export default PasswordGeneration;
