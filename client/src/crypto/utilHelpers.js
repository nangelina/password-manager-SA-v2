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

export function fromB64 (b64) {
    const binary = Buffer.from(b64, 'base64').toString('utf-8');
    var buf = new ArrayBuffer(binary.length); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = binary.length; i < strLen; i++) {
        bufView[i] = binary.charCodeAt(i);
    }
    return buf;
}
