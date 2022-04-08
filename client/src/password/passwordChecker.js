import sha1 from 'sha1';

// https://haveibeenpwned.com/API/v2#SearchingPwnedPasswordsByRange
const HASH_PREFIX_LENGTH = 5;

export default async function checkPasswordPwnedCount (password) {
    if (!password) return;

    const hash = sha1(password).toUpperCase();

    const prefix = hash.substring(0, HASH_PREFIX_LENGTH);
    const suffix = hash.substring(HASH_PREFIX_LENGTH);

    const resp = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
        headers: {
            Accept: "application/vnd.haveibeenpwned.v2+json"
        }
    });

    const message = await resp.text();

    if (!resp.ok) throw new Error(message);

    const entries = message.split('\n');

    const results = entries.map(entry => {
        const [suffix, count] = entry.split(":");
        return {
            suffix,
            count: parseInt(count, 10)
        };
    });

    const result = results.find(result => result.suffix === suffix);

    return result ? result.count : 0;
}
