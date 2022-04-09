const passwordGen = require('generate-password-browser');
// import * as passphraseGen from 'generate-passphrase';


/**
 * @param {Boolean} isPassphrase
 * @param {List} options - {length, numbers, symbols, lowercase, uppercase, excludeSimilarCharacters} : All Booleans
 */
export default function generatePassword (isPassphrase, options) {
    try {
        // if (isPassphrase) {
        //     return passphraseGen.generate(options);
        // } else {
        return passwordGen.generate({ ...options, excludeSimilarCharacters: true });
        // }
    } catch (error) {
        return '';
    }
}
