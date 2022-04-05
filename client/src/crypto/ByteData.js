import { toB64 } from './utilHelpers';

export default class ByteData {
    constructor(buf) {
        if (!arguments.length) {
            this.arr = null;
            this.b64 = null;
            return;
        }

        this.arr = new Uint8Array(buf);
        this.b64 = toB64(buf);
    }
}
