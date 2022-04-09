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

const styles = {
  body: {
    paddingBottom: '50px',
  },

  h1: {
    borderBottom: '2px solid #ced4da',
    marginBottom: '20px',
    paddingBottom: '10px',
    marginTop: '50px',
  },

  h2: {
    fontSize: '24px',
  },

  h3: {
    fontSize: '18px',
  },

  pre: {
    padding: '9.5px',
    lineHeight: '1.42857143',
    wordBreak: 'breakAll',
    wordWrap: 'breakWord',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ced4da',
    borderRadius: '4px',
  },

  section: {
    marginBottom: '50px',
  },
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

  const [publicKey, setPublicKey] = useState(new ByteData());
  const [privateKey, setPrivateKey] = useState(new ByteData());
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState(
    new Cipher()
  );
  const [decryptedPrivateKey, setDecryptedPrivateKey] = useState(
    new ByteData()
  );

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
    const newSymKey = new Uint8Array(512 / 8);
    crypto.getRandomValues(newSymKey);
    setSymKey(new SymmetricCryptoKey(newSymKey));

    const keyPair = await generateRsaKeyPair();
    setPublicKey(keyPair.publicKey);
    setPrivateKey(keyPair.privateKey);
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

  useEffect(() => {
    async function encryptDecryptPrivateKey () {
      if (!symKey || !symKey.key || !privateKey || !privateKey.arr) {
        setEncryptedPrivateKey(new Cipher());
        return;
      }

      const newEncryptedPrivateKey = await aesEncrypt(
        privateKey.arr,
        symKey.encKey,
        symKey.macKey
      );
      const newDecryptedPrivateKey = await aesDecrypt(
        newEncryptedPrivateKey,
        symKey.encKey,
        symKey.macKey
      );

      setEncryptedPrivateKey(newEncryptedPrivateKey);
      setDecryptedPrivateKey(new ByteData(newDecryptedPrivateKey));
    }
    encryptDecryptPrivateKey();
  }, [symKey, privateKey]);

  useEffect(() => {
    generateKeys();
  }, []);

  return (
    <div className="container" id="app">
      <h1 style={styles.h1}>Key Derivation</h1>

      <form>
        <div className="row">
          <div className="col-sm-4">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <label htmlFor="masterPassword">
                Master Password
              </label>
              <input
                type="password"
                id="masterPassword"
                className="form-control"
                value={masterPassword}
                onChange={(e) =>
                  setMasterPassword(e.target.value)
                }
              />
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <label htmlFor="pbkdf2Iterations">
                Client PBKDF2 Iterations
              </label>
              <input
                type="number"
                id="pbkdf2Iterations"
                className="form-control"
                value={pbkdf2Iterations}
                onChange={(e) =>
                  setPbkdf2Iterations(e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </form>

      <section style={styles.section}>
        <h2 style={styles.h2}>Master Key</h2>
        <pre style={styles.pre}>{masterKey.b64}</pre>
      </section>

      <section style={styles.section}>
        <h2 style={styles.h2}>Master Password Hash</h2>
        <pre style={styles.pre}>{masterKeyHash.b64}</pre>
      </section>

      <section style={styles.section}>
        <h2 style={styles.h2}>Stretched Master Key</h2>
        <pre style={styles.pre}>{stretchedMasterKey.key.b64}</pre>
        <h3 style={styles.h3}>Encryption Key</h3>
        <pre style={styles.pre}>{stretchedMasterKey.encKey.b64}</pre>
        <h3 style={styles.h3}>MAC Key</h3>
        <pre style={styles.pre}>{stretchedMasterKey.macKey.b64}</pre>
      </section>

      <section style={styles.section}>
        <h2 style={styles.h2}>Generated Symmetric Key</h2>
        <pre style={styles.pre}>{symKey.key.b64}</pre>
        <h3 style={styles.h3}>Encryption Key</h3>
        <pre style={styles.pre}>{symKey.encKey.b64}</pre>
        <h3 style={styles.h3}>MAC Key</h3>
        <pre style={styles.pre}>{symKey.macKey.b64}</pre>
        <h3 style={styles.h3}>Encrypted Symmetric Key</h3>
        <pre style={styles.pre}>{encryptedSymKey.string}</pre>
        <h3 style={styles.h3}>Decrypted Symmetric Key</h3>
        <pre style={styles.pre}>{decryptedSymKey.b64}</pre>
      </section>

      <section style={styles.section}>
        <h2 style={styles.h2}>Generated RSA Key Pair</h2>
        <h3 style={styles.h3}>Public Key</h3>
        <pre style={styles.pre}>{publicKey.b64}</pre>
        <h3 style={styles.h3}>Private Key</h3>
        <pre style={styles.pre}>{privateKey.b64}</pre>
        <h3 style={styles.h3}>Encrypted Private Key</h3>
        <pre style={styles.pre}>{encryptedPrivateKey.string}</pre>
        <h3 style={styles.h3}>Decrypted Private Key</h3>
        <pre style={styles.pre}>{decryptedPrivateKey.b64}</pre>
      </section>

      <button
        type="button"
        id="deriveKeys"
        className="btn btn-primary"
        onClick={generateKeys}
      >
        <i className="fa fa-refresh"></i> Regenerate Keys
      </button>

      <h1 style={styles.h1}>Encryption</h1>

      <form>
        <div className="form-group">
          <label htmlFor="secret">Secret Value</label>
          <textarea
            id="secret"
            className="form-control"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          ></textarea>
        </div>
      </form>

      <h2 style={styles.h2}>{'The "Cipher String"'}</h2>
      <pre style={styles.pre}>{encryptedSecret.string}</pre>

      <h2 style={styles.h2}>Decrypt</h2>
      <textarea
        className="form-control"
        value={decryptedSecret}
        readOnly
      ></textarea>
    </div>
  );
}

export default Crypto;
