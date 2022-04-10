import React, { useEffect, useMemo, useState } from 'react';
import ByteData from '../crypto/ByteData';
import Cipher from '../crypto/Cipher';
import SymmetricCryptoKey from '../crypto/SymmetricCryptoKey';
import {
  aesDecrypt,
  aesEncrypt,
  generateRsaKeyPair,
  pbkdf2,
  stretchKey,
} from '../crypto/cryptoHelpers';
import { fromUtf8, toUtf8 } from '../crypto/utilHelpers';

import FormItem from '../components/FormItem';
import PasswordItem from '../components/PasswordItem';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const blockStyle = {
  overflow: 'auto',
  my: 2,
  p: 1,
  bgcolor: (theme) =>
    theme.palette.mode === 'dark' ? '#101010' : 'grey.100',
  color: (theme) =>
    theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
  border: '1px solid',
  borderColor: (theme) =>
    theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
  borderRadius: 2,
};

function Crypto () {

  // data

  const [email, setEmail] = useState('user@example.com');
  const [masterPassword, setMasterPassword] = useState('password123');
  const [pbkdf2Iterations, setPbkdf2Iterations] = useState(100000);

  const [masterKey, setMasterKey] = useState(new ByteData());
  const [masterKeyHash, setMasterKeyHash] = useState(new ByteData());
  const [stretchedMasterKey, setStretchedMasterKey] = useState(
    new SymmetricCryptoKey()
  );

  const [symKey, setSymKey] = useState(new SymmetricCryptoKey());
  const [encryptedSymKey, setEncryptedSymKey] = useState(new Cipher());
  const [decryptedSymKey, setDecryptedSymKey] = useState(new ByteData());

  // const [publicKey, setPublicKey] = useState(new ByteData());
  // const [privateKey, setPrivateKey] = useState(new ByteData());
  // const [encryptedPrivateKey, setEncryptedPrivateKey] = useState(
  //   new Cipher()
  // );
  // const [decryptedPrivateKey, setDecryptedPrivateKey] = useState(
  //   new ByteData()
  // );

  const [secret, setSecret] = useState('This is a secret.');
  const [encryptedSecret, setEncryptedSecret] = useState(new Cipher());
  const [decryptedSecret, setDecryptedSecret] = useState('');

  // computed

  const masterPasswordBuffer = useMemo(
    () => (masterPassword ? fromUtf8(masterPassword) : null),
    [masterPassword]
  );
  const emailBuffer = useMemo(
    () => (email ? fromUtf8(email) : null),
    [email]
  );
  const secretBuffer = useMemo(
    () => (secret ? fromUtf8(secret) : null),
    [secret]
  );

  // methods

  async function generateKeys () {
    console.log('hello');
    const newSymKey = new Uint8Array(512 / 8);
    crypto.getRandomValues(newSymKey);
    setSymKey(new SymmetricCryptoKey(newSymKey));

    // const keyPair = await generateRsaKeyPair();
    // setPublicKey(keyPair.publicKey);
    // setPrivateKey(keyPair.privateKey);
  }

  // watch

  useEffect(() => {
    async function onMasterKeyChange () {
      if (masterKey && !masterKey.arr && !masterKey.b64) return;

      if (!masterKey || !masterKey.arr || !masterPasswordBuffer) {
        setMasterKey(new ByteData());
      }

      const newStretchedMasterKey = await stretchKey(
        masterKey.arr.buffer
      );
      const newMasterKeyHash = await pbkdf2(
        masterKey.arr.buffer,
        masterPasswordBuffer,
        1,
        256
      );

      setStretchedMasterKey(newStretchedMasterKey);
      setMasterKeyHash(newMasterKeyHash);
    }
    onMasterKeyChange();
  }, [masterKey]);

  useEffect(() => {
    async function generateMasterKey () {
      if (
        !masterPasswordBuffer ||
        !emailBuffer ||
        !pbkdf2Iterations ||
        pbkdf2Iterations < 1
      ) {
        setMasterKey(new ByteData());
        return;
      }

      setMasterKey(
        await pbkdf2(
          masterPasswordBuffer,
          emailBuffer,
          pbkdf2Iterations,
          256
        )
      );
    }
    generateMasterKey();
  }, [masterPasswordBuffer, emailBuffer, pbkdf2Iterations]);

  useEffect(() => {
    async function encryptDecryptSecret () {
      if (!symKey || !secretBuffer) {
        setEncryptedSecret(new Cipher());
        setDecryptedSecret('');
        return;
      }

      const newEncryptedSecret = await aesEncrypt(
        secretBuffer,
        symKey.encKey,
        symKey.macKey
      );
      const newDecryptedSecret = await aesDecrypt(
        newEncryptedSecret,
        symKey.encKey,
        symKey.macKey
      );

      setEncryptedSecret(newEncryptedSecret);
      setDecryptedSecret(toUtf8(newDecryptedSecret));
    }
    encryptDecryptSecret();
  }, [symKey, secretBuffer]);

  useEffect(() => {
    async function encryptDecryptSymKey () {
      if (
        !stretchedMasterKey ||
        !stretchedMasterKey.key ||
        !stretchedMasterKey.key.arr ||
        !symKey ||
        !symKey.key ||
        !symKey.key.arr
      ) {
        setEncryptedSymKey(new Cipher());
        return;
      }

      const newEncryptedSymKey = await aesEncrypt(
        symKey.key.arr,
        stretchedMasterKey.encKey,
        stretchedMasterKey.macKey
      );
      const newDecryptedSymKey = await aesDecrypt(
        newEncryptedSymKey,
        stretchedMasterKey.encKey,
        stretchedMasterKey.macKey
      );

      setEncryptedSymKey(newEncryptedSymKey);
      setDecryptedSymKey(new ByteData(newDecryptedSymKey));
    }
    encryptDecryptSymKey();
  }, [stretchedMasterKey, symKey]);

  // useEffect(() => {
  //   async function encryptDecryptPrivateKey () {
  //     if (!symKey || !symKey.key || !privateKey || !privateKey.arr) {
  //       setEncryptedPrivateKey(new Cipher());
  //       return;
  //     }

  //     const newEncryptedPrivateKey = await aesEncrypt(
  //       privateKey.arr,
  //       symKey.encKey,
  //       symKey.macKey
  //     );
  //     const newDecryptedPrivateKey = await aesDecrypt(
  //       newEncryptedPrivateKey,
  //       symKey.encKey,
  //       symKey.macKey
  //     );

  //     setEncryptedPrivateKey(newEncryptedPrivateKey);
  //     setDecryptedPrivateKey(new ByteData(newDecryptedPrivateKey));
  //   }
  //   encryptDecryptPrivateKey();
  // }, [symKey, privateKey]);

  useEffect(() => {
    generateKeys();
  }, []);

  return (
    <div className="container" id="app" style={{ margin: '0 1em 1em' }}>
      <div style={{ position: 'sticky', top: '69px', backgroundColor: 'white', marginBottom: '1em', zIndex: 10 }}>
        <Typography variant="h5" gutterBottom pt="1em">Key Derivation</Typography>

        <Card >
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormItem
                  label="Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <PasswordItem
                  label="Master Password"
                  value={masterPassword}
                  onChange={(e) =>
                    setMasterPassword(e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>

      <section>
        <Typography variant="h6" gutterBottom>Master Key</Typography>
        <Box component="div" sx={blockStyle}>
          {masterKey.b64}
        </Box>
      </section>

      <section>
        <Typography variant="h6" gutterBottom>Master Password Hash</Typography>
        <Box component="div" sx={blockStyle}>
          {masterKeyHash.b64}
        </Box>
      </section>

      <section>
        <Typography variant="h6" gutterBottom>Stretched Master Key</Typography>
        <Box component="div" sx={blockStyle}>
          {stretchedMasterKey.key.b64}
        </Box>
        <Typography variant="h7" gutterBottom>Encryption Key</Typography>
        <Box component="div" sx={blockStyle}>
          {stretchedMasterKey.encKey.b64}
        </Box>
        <Typography variant="h7" gutterBottom>MAC Key</Typography>
        <Box component="div" sx={blockStyle}>
          {stretchedMasterKey.macKey.b64}
        </Box>
      </section>

      <section>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant="h6" gutterBottom>Generated Symmetric Key</Typography>

          <Button variant='contained' onClick={generateKeys} >
            Regenerate Keys
          </Button>
        </div>
        <Box component="div" sx={blockStyle}>
          {symKey.key.b64}
        </Box>
        <Typography variant="h7" gutterBottom>Encryption Key</Typography>
        <Box component="div" sx={blockStyle}>
          {symKey.encKey.b64}
        </Box>
        <Typography variant="h7" gutterBottom>MAC Key</Typography>
        <Box component="div" sx={blockStyle}>
          {symKey.macKey.b64}
        </Box>
        <Typography variant="h7" gutterBottom>Encrypted Symmetric Key</Typography>
        <Box component="div" sx={blockStyle}>
          {encryptedSymKey.string}
        </Box>
        <Typography variant="h7" gutterBottom>Decrypted Symmetric Key</Typography>
        <Box component="div" sx={blockStyle}>
          {decryptedSymKey.b64}
        </Box>
      </section>

      {/* <section>
        <Typography variant="h6" gutterBottom>Generated RSA Key Pair</Typography>
        <Typography variant="h7" gutterBottom>Public Key</Typography>
        <Box component="div" sx={blockStyle}>
          {publicKey.b64}
        </Box>
        <Typography variant="h7" gutterBottom>Private Key</Typography>
        <Box component="div" sx={blockStyle}>
          {privateKey.b64}
        </Box>
        <Typography variant="h7" gutterBottom>Encrypted Private Key</Typography>
        <Box component="div" sx={blockStyle}>
          {encryptedPrivateKey.string}
        </Box>
        <Typography variant="h7" gutterBottom>Decrypted Private Key</Typography>
        <Box component="div" sx={blockStyle}>
          {decryptedPrivateKey.b64}
        </Box>
      </section> */}

      <Typography variant="h5" gutterBottom>Encryption</Typography>

      <TextField
        label="Secret"
        multiline
        fullWidth
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        style={{
          margin: '1em 0'
        }}
        rows={4}
      />

      <Typography variant="h6" gutterBottom>Encrypted Secret</Typography>
      <Box component="div" sx={blockStyle}>
        {encryptedSecret.string}
      </Box>

      <Typography variant="h6" gutterBottom>Decrypted Secret</Typography>
      <TextField
        label=""
        multiline
        fullWidth
        value={decryptedSecret}
        disabled
      />
    </div>
  );
}

export default Crypto;
