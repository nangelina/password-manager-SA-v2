import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { decryptSymKey, encryptSecret, decryptSecret } from '../crypto/cryptoAppHelpers';
import Cipher from '../crypto/Cipher';
import { stringToCipher } from '../crypto/utilHelpers';
import SymmetricCryptoKey from '../crypto/SymmetricCryptoKey';

export const UserContext = createContext();

function UserProvider ({ children }) {
  const [user, setUser] = useState(null);
  const [stretchedMasterKey, setStretchedMasterKey] = useState(new SymmetricCryptoKey());
  const [symKey, setSymKey] = useState(new Cipher());
  const [vault, setVault] = useState([]);

  async function decryptSymKeyFromString () {
    const cipher = stringToCipher(user.symKey);
    console.log('decryptSymKeyFromString:', 'cipher', cipher, 'stretchedMasterKey', stretchedMasterKey);
    const decryptedSymKey = await decryptSymKey(cipher, stretchedMasterKey);
    setSymKey(decryptedSymKey);
  }

  async function decryptVaultFromString () {
    console.log('user.vault', user.vault);
    const cipher = stringToCipher(user.vault);
    console.log('user.vault === cipher?', user.vault === cipher.string);
    console.log('decryptVaultFromString:', 'cipher', cipher, 'symKey', symKey);
    const decryptedVault = await decryptSecret(cipher, symKey);
    console.log('decryptedVaultSecret', decryptedVault);
    try {
      const parsed = JSON.parse(decryptedVault);
      setVault(parsed);
      setUser({ ...user, vault: undefined });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (user) {
      if (user.symKey && stretchedMasterKey) {
        decryptSymKeyFromString();
      }
      if (user.vault && symKey) {
        decryptVaultFromString();
      }
    }
  }, [user, stretchedMasterKey]);

  function addVaultItem (item) {
    if (!item.url || !item.username || !item.password)
      throw new Error('Please fill all required fields');
    setVault([...vault, item]);
  }

  useEffect(() => {
    async function updateServerVault () {
      if (!vault) return;

      const secret = JSON.stringify(vault);
      const encryptedSecret = await encryptSecret(secret, symKey);

      // console.log('am here', 'encryptedSecret', encryptedSecret);
      // const cipher = stringToCipher(encryptedSecret.string);

      // console.log('encryptedSecret', encryptedSecret, 'vs cipher', cipher, 'symKey', symKey);
      // const decryptedVault = await decryptSecret(cipher, symKey);
      // console.log('decryptedVault', decryptedVault);
      // console.log('parse', JSON.parse(decryptedVault));

      axios
        .post('/api/vault', {
          encryptedVault: encryptedSecret.string
        })
        .catch((err) => {
          alert("Error: Couldn't save vault: " + err);
        });
    }
    updateServerVault();
  }, [vault, symKey])

  return (
    <div>
      <UserContext.Provider value={{ user, setUser, vault, addVaultItem, setStretchedMasterKey }}>
        {children}
      </UserContext.Provider>
    </div>
  );
}
export default UserProvider;
