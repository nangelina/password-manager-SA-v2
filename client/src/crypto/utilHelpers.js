import { Buffer } from 'buffer';

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
