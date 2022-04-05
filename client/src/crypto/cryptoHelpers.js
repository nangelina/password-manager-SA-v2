import ByteData from './ByteData';
import Cipher from './Cipher';
import SymmetricCryptoKey from './SymmetricCryptoKey';
import encTypes from './encTypes';
import { fromUtf8 } from './utilHelpers';

export async function pbkdf2(password, salt, iterations, length) {
    const importAlg = {
        name: 'PBKDF2',
    };

    const deriveAlg = {
        name: 'PBKDF2',
        salt: salt,
        iterations: iterations,
        hash: { name: 'SHA-256' },
    };

    const aesOptions = {
        name: 'AES-CBC',
        length: length,
    };

    try {
        const importedKey = await crypto.subtle.importKey(
            'raw',
            password,
            importAlg,
            false,
            ['deriveKey']
        );
        const derivedKey = await crypto.subtle.deriveKey(
            deriveAlg,
            importedKey,
            aesOptions,
            true,
            ['encrypt']
        );
        const exportedKey = await crypto.subtle.exportKey('raw', derivedKey);
        return new ByteData(exportedKey);
    } catch (err) {
        console.log(err);
    }
}

export async function aesEncrypt(data, encKey, macKey) {
    const keyOptions = {
        name: 'AES-CBC',
    };

    const encOptions = {
        name: 'AES-CBC',
        iv: new Uint8Array(16),
    };
    crypto.getRandomValues(encOptions.iv);
    const ivData = new ByteData(encOptions.iv.buffer);

    try {
        const importedKey = await crypto.subtle.importKey(
            'raw',
            encKey.arr.buffer,
            keyOptions,
            false,
            ['encrypt']
        );
        const encryptedBuffer = await crypto.subtle.encrypt(
            encOptions,
            importedKey,
            data
        );
        const ctData = new ByteData(encryptedBuffer);
        let type = encTypes.AesCbc256_B64;
        let macData;
        if (macKey) {
            const dataForMac = buildDataForMac(ivData.arr, ctData.arr);
            const macBuffer = await computeMac(
                dataForMac.buffer,
                macKey.arr.buffer
            );
            type = encTypes.AesCbc256_HmacSha256_B64;
            macData = new ByteData(macBuffer);
        }
        return new Cipher(type, ivData, ctData, macData);
    } catch (err) {
        console.error(err);
    }
}

export async function aesDecrypt(cipher, encKey, macKey) {
    const keyOptions = {
        name: 'AES-CBC',
    };

    const decOptions = {
        name: 'AES-CBC',
        iv: cipher.iv.arr.buffer,
    };

    try {
        const checkMac = cipher.encType !== encTypes.AesCbc256_B64;
        if (checkMac) {
            if (!macKey) {
                throw new Error('MAC key not provided.');
            }
            const dataForMac = buildDataForMac(cipher.iv.arr, cipher.ct.arr);
            const macBuffer = await computeMac(
                dataForMac.buffer,
                macKey.arr.buffer
            );
            const macsMatch = await macsEqual(
                cipher.mac.arr.buffer,
                macBuffer,
                macKey.arr.buffer
            );
            if (!macsMatch) {
                throw new Error('MAC check failed.');
            }
            const importedKey = await crypto.subtle.importKey(
                'raw',
                encKey.arr.buffer,
                keyOptions,
                false,
                ['decrypt']
            );
            return crypto.subtle.decrypt(
                decOptions,
                importedKey,
                cipher.ct.arr.buffer
            );
        }
    } catch (err) {
        console.error(err);
    }
}

export async function computeMac(data, key) {
    const alg = {
        name: 'HMAC',
        hash: { name: 'SHA-256' },
    };
    const importedKey = await crypto.subtle.importKey('raw', key, alg, false, [
        'sign',
    ]);
    return crypto.subtle.sign(alg, importedKey, data);
}

export async function macsEqual(mac1Data, mac2Data, key) {
    const alg = {
        name: 'HMAC',
        hash: { name: 'SHA-256' },
    };

    const importedMacKey = await crypto.subtle.importKey(
        'raw',
        key,
        alg,
        false,
        ['sign']
    );
    const mac1 = await crypto.subtle.sign(alg, importedMacKey, mac1Data);
    const mac2 = await crypto.subtle.sign(alg, importedMacKey, mac2Data);

    if (mac1.byteLength !== mac2.byteLength) {
        return false;
    }

    const arr1 = new Uint8Array(mac1);
    const arr2 = new Uint8Array(mac2);

    for (let i = 0; i < arr2.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}

function buildDataForMac(ivArr, ctArr) {
    const dataForMac = new Uint8Array(ivArr.length + ctArr.length);
    dataForMac.set(ivArr, 0);
    dataForMac.set(ctArr, ivArr.length);
    return dataForMac;
}

export async function generateRsaKeyPair() {
    const rsaOptions = {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: { name: 'SHA-1' },
    };

    try {
        const keyPair = await crypto.subtle.generateKey(rsaOptions, true, [
            'encrypt',
            'decrypt',
        ]);
        const publicKey = new ByteData(
            await crypto.subtle.exportKey('spki', keyPair.publicKey)
        );
        const privateKey = new ByteData(
            await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
        );
        return {
            publicKey: publicKey,
            privateKey: privateKey,
        };
    } catch (err) {
        console.error(err);
    }
}

export async function stretchKey(key) {
    const newKey = new Uint8Array(64);
    newKey.set(await hkdfExpand(key, new Uint8Array(fromUtf8('enc')), 32));
    newKey.set(await hkdfExpand(key, new Uint8Array(fromUtf8('mac')), 32), 32);
    return new SymmetricCryptoKey(newKey.buffer);
}

// ref: https://tools.ietf.org/html/rfc5869
export async function hkdfExpand(prk, info, size) {
    const alg = {
        name: 'HMAC',
        hash: { name: 'SHA-256' },
    };
    const importedKey = await crypto.subtle.importKey('raw', prk, alg, false, [
        'sign',
    ]);
    const hashLen = 32; // sha256
    const okm = new Uint8Array(size);
    let previousT = new Uint8Array(0);
    const n = Math.ceil(size / hashLen);
    for (let i = 0; i < n; i++) {
        const t = new Uint8Array(previousT.length + info.length + 1);
        t.set(previousT);
        t.set(info, previousT.length);
        t.set([i + 1], t.length - 1);
        previousT = new Uint8Array(
            await crypto.subtle.sign(alg, importedKey, t.buffer)
        );
        okm.set(previousT, i * hashLen);
    }
    return okm;
}
