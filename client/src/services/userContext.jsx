import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
  decryptSymKey,
  encryptSecret,
  decryptSecret,
} from '../crypto/cryptoAppHelpers';
import { stringToCipher } from '../crypto/utilHelpers';
import SymmetricCryptoKey from '../crypto/SymmetricCryptoKey';

export const UserContext = createContext();

function UserProvider ({ children }) {
  const [user, setUser] = useState(null);
  const [stretchedMasterKey, setStretchedMasterKey] = useState(
    new SymmetricCryptoKey()
  );
  const [symKey, setSymKey] = useState(new SymmetricCryptoKey());
  const [vault, setVault] = useState({});

  function logOut () {
    setUser(null);
    setStretchedMasterKey(new SymmetricCryptoKey());
    setSymKey(new SymmetricCryptoKey());
    setVault({});
  }

  async function decryptSymKeyFromString () {
    const cipher = stringToCipher(user.symKey);
    const decryptedSymKey = await decryptSymKey(cipher, stretchedMasterKey);
    setUser((prevState) => ({ ...prevState, symKey: undefined }));
    setSymKey(decryptedSymKey);
  }

  async function decryptVaultFromString () {
    if (!(symKey.key && symKey.key.b64)) {
      logOut();
      return;
    }

    const cipher = stringToCipher(user.vault);
    const decryptedVault = await decryptSecret(cipher, symKey);
    try {
      const parsed = JSON.parse(decryptedVault);
      setUser((prevState) => ({ ...prevState, vault: undefined }));
      setVault(parsed);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (user) {
      if (user.symKey) {
        if (stretchedMasterKey.key && stretchedMasterKey.key.b64) {
          decryptSymKeyFromString();
        }
      } else {
        if (user.vault && symKey.key && symKey.key.b64) {
          decryptVaultFromString();
        }
      }
    }
  }, [user, stretchedMasterKey, symKey]);

  useEffect(() => {
    async function updateServerVault () {
      if (!(symKey.key && symKey.key.b64)) {
        logOut();
        return;
      }

      const secret = JSON.stringify(vault);
      const encryptedSecret = await encryptSecret(secret, symKey);

      axios
        .post('/api/vault', {
          encryptedVault: encryptedSecret.string,
        })
        .catch((err) => {
          alert("Error: Couldn't save vault: " + err);
        });
    }

    if (vault && Object.keys(vault).length > 0) updateServerVault();
  }, [vault]);

  return (
    <div>
      <UserContext.Provider
        value={{
          user,
          setUser,
          logOut,
          vault,
          setVault,
          setStretchedMasterKey,
        }}
      >
        {children}
      </UserContext.Provider>
    </div>
  );
}
export default UserProvider;
