export default class Cipher {
    constructor(encType, iv, ct, mac) {
        if (!arguments.length) {
            this.encType = null;
            this.iv = null;
            this.ct = null;
            this.mac = null;
            this.string = null;
            return;
        }

        this.encType = encType;
        this.iv = iv;
        this.ct = ct;
        this.string = encType + '.' + iv.b64 + '|' + ct.b64;

        this.mac = null;
        if (mac) {
            this.mac = mac;
            this.string += '|' + mac.b64;
        }
    }
}
