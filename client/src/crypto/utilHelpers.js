import { Buffer } from 'buffer';
import ByteData from './ByteData';
import Cipher from './Cipher';

export function fromUtf8(str) {
    const strUtf8 = encodeURIComponent(str);
    const bytes = new Uint8Array(strUtf8.length);
    for (let i = 0; i < strUtf8.length; i++) {
        bytes[i] = strUtf8.charCodeAt(i);
    }
    return bytes.buffer;
}

export function toUtf8(buf) {
    const bytes = new Uint8Array(buf);
    const encodedString = String.fromCharCode.apply(null, bytes);
    return decodeURIComponent(encodedString);
}

export function toB64(buf) {
    let binary = '';
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return Buffer.from(binary).toString('base64');
}

export function fromB64 (b64) {
    const binary = Buffer.from(b64, 'base64').toString('utf-8');
    var buf = new ArrayBuffer(binary.length); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = binary.length; i < strLen; i++) {
        bufView[i] = binary.charCodeAt(i);
    }
    return buf;
}

export function stringToCipher (string) {
    const [encType, ivB64, ctB64, macB64] = string.split(/[|.]+/);
    const iv = new ByteData(fromB64(ivB64));
    const ct = new ByteData(fromB64(ctB64));
    const mac = macB64 ? new ByteData(fromB64(macB64)) : null;
    return new Cipher(parseInt(encType), iv, ct, mac);
}
