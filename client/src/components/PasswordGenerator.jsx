import React, { useState, useEffect } from 'react';

import generatePassword from '../password/passwordGenerator';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';

export default function PasswordGenerator ({ showGenerate, onChange }) {
  const [radio, setRadio] = useState('password');
  const [length, setLength] = useState(14);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);

  async function generate () {
    if (showGenerate) {
      const event = {
        target: {
          value: generatePassword(radio === 'passphrase', {
            length,
            numbers,
            symbols,
            lowercase,
            uppercase,
          }),
        },
      };
      onChange(event);
    }
  }

  useEffect(generate, [showGenerate, radio, length, symbols, uppercase, lowercase, numbers]);

  const handleRadioChange = (event) => {
    setRadio(event.target.value);
  };

  const handleSliderChange = (event, newValue) => {
    setLength(newValue);
  };

  const handleSliderInputChange = (event) => {
    setLength(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleSliderInputBlur = () => {
    if (length < 6) {
      setLength(6);
    } else if (length > 64) {
      setLength(64);
    }
  };

  return (
    <Card>
      <CardContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '2em',
            marginBottom: '1em',
          }}
        >
          <Typography variant="h5">Generate Password</Typography>
          <Button variant="outlined" onClick={generate}>Regenerate</Button>
        </div>
        <FormControl>
          {/* <FormLabel focused={false}>Type</FormLabel>
          <RadioGroup
            row
            aria-labelledby="password-type-label"
            name="password-type"
            value={radio}
            onChange={handleRadioChange}
          >
            <FormControlLabel
              value="password"
              control={<Radio />}
              label="Password"
            />
            <FormControlLabel
              value="passphrase"
              control={<Radio />}
              label="Passphrase"
            />
          </RadioGroup> */}
          <FormLabel focused={false}>Length</FormLabel>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Slider
                value={typeof length === 'number' ? length : 0}
                min={6}
                max={64}
                step={1}
                onChange={handleSliderChange}
                aria-labelledby="password-length-slider"
              />
            </Grid>
            <Grid item>
              <Input
                value={length}
                size="small"
                onChange={handleSliderInputChange}
                onBlur={handleSliderInputBlur}
                inputProps={{
                  step: 1,
                  min: 6,
                  max: 64,
                  type: 'number',
                  'aria-labelledby': 'password-length-slider',
                }}
              />
            </Grid>
          </Grid>
          <FormLabel focused={false}>Additional Options</FormLabel>
          <FormGroup
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto auto auto auto',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={uppercase}
                  onChange={(event) =>
                    setUppercase(event.target.checked)
                  }
                  name={'uppercase'}
                />
              }
              label="A-Z"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={lowercase}
                  onChange={(event) =>
                    setLowercase(event.target.checked)
                  }
                  name={'lowercase'}
                />
              }
              label="a-z"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={numbers}
                  onChange={(event) =>
                    setNumbers(event.target.checked)
                  }
                  name={'numbers'}
                />
              }
              label="0-9"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={symbols}
                  onChange={(event) =>
                    setSymbols(event.target.checked)
                  }
                  name={'symbols'}
                />
              }
              label="!@#$%^&amp;*"
            />
          </FormGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
}
