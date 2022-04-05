import ByteData from './ByteData';

export default class SymmetricCryptoKey {
    constructor(buf) {
        if (!arguments.length) {
            this.key = new ByteData();
            this.encKey = new ByteData();
            this.macKey = new ByteData();
            return;
        }

        this.key = new ByteData(buf);

        // First half
        const encKey = this.key.arr.slice(0, this.key.arr.length / 2).buffer;
        this.encKey = new ByteData(encKey);

        // Second half
        const macKey = this.key.arr.slice(this.key.arr.length / 2).buffer;
        this.macKey = new ByteData(macKey);
    }
}
