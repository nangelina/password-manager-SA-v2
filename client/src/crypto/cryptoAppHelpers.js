/**
 * User Account Creation
 *
 * When the Create Account form is submitted, Password-Based Key Derivation
 * Function 2 (PBKDF2) with 100,000 iteration rounds is used to stretch the
 * user's Master Password with a salt of the user's email address. The resulting
 * salted value is the 256 bit Master Key.
 *
 * The Master Key is additionally stretched to 512 bits in length using
 * HMAC-based Extract-and-Expand Key Derivation Function (HKDF).
 *
 * The Master Key and Stretched Master Key are never stored on or transmitted to
 * the server.
 *
 * In addition, a 512-bit Symmetric Key and an Initialization Vector is
 * generated using a Cryptographically Secure Pseudorandom Number Generator
 * (CSPRNG).
 *
 * The Symmetric key is encrypted with AES-256 bit encryption using the
 * Stretched Master Key and the Initialization Vector. The resulting key is
 * called the Encrypted Symmetric Key.
 *
 * The Encrypted Symmetric Key is the main key associated with the user and sent
 * to the server upon account creation, and sent back to the client upon syncing.
 */

import { fromUtf8, toUtf8 } from './utilHelpers.js';
import ByteData from './ByteData.js';
import {
    aesEncrypt,
    aesDecrypt,
    pbkdf2,
    stretchKey,
} from './cryptoHelpers.js';
import SymmetricCryptoKey from './SymmetricCryptoKey.js';
import Cipher from './Cipher.js';

export async function generateMasterKey (username, masterPassword) {
    if (!username || !masterPassword) return new ByteData();

    const usernameBuffer = fromUtf8(username);
    const passwordBuffer = fromUtf8(masterPassword);
    if (!usernameBuffer || !passwordBuffer) return new ByteData();

    return await pbkdf2(passwordBuffer, usernameBuffer, 100000, 256);
}

export async function stretchMasterKey (masterKey) {
    if (!masterKey || !masterKey.arr) return new SymmetricCryptoKey();
    return await stretchKey(masterKey.arr.buffer);
}

export async function generateMasterKeyHash (masterKey, password) {
    if (!masterKey || !masterKey.arr) return new ByteData();

    const passwordBuffer = fromUtf8(password);
    if (!passwordBuffer) return new ByteData();

    return await pbkdf2(masterKey.arr.buffer, passwordBuffer, 1, 256);
}

export function generateSymKey () {
    const newSymKey = new Uint8Array(512 / 8);
    crypto.getRandomValues(newSymKey);
    return new SymmetricCryptoKey(newSymKey);
}

export async function encryptSymKey (symKey, stretchedMasterKey) {
    if (
        !stretchedMasterKey ||
        !stretchedMasterKey.key ||
        !stretchedMasterKey.key.arr ||
        !symKey ||
        !symKey.key ||
        !symKey.key.arr
    ) {
        return new Cipher();
    }

    return await aesEncrypt(
        symKey.key.arr,
        stretchedMasterKey.encKey,
        stretchedMasterKey.macKey
    );
}

export async function decryptSymKey (encryptedSymKey, stretchedMasterKey) {
    if (
        !stretchedMasterKey ||
        !stretchedMasterKey.encKey ||
        !stretchedMasterKey.macKey
    ) {
        return new SymmetricCryptoKey();
    }

    const decryptedSymKey = await aesDecrypt(
        encryptedSymKey,
        stretchedMasterKey.encKey,
        stretchedMasterKey.macKey
    );
    return new SymmetricCryptoKey(decryptedSymKey);
}

export async function decryptSecret (encryptedSecret, symKey) {
    if (!symKey) return '';
    const decryptedSecret = await aesDecrypt(
        encryptedSecret,
        symKey.encKey,
        symKey.macKey
    );
    return toUtf8(decryptedSecret);
}

export async function encryptSecret (secret, symKey) {
    const secretBuffer = secret ? fromUtf8(secret) : null;
    if (!symKey || !secretBuffer) {
        return new Cipher();
    }

    return await aesEncrypt(secretBuffer, symKey.encKey, symKey.macKey);
}
