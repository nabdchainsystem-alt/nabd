import crypto from 'crypto';

const RAW_KEY = process.env.ENCRYPTION_KEY || 'default_key_needs_to_be_32_bytes__';
// Ensure key is exactly 32 bytes by hashing it
const ENCRYPTION_KEY = crypto.createHash('sha256').update(RAW_KEY).digest();
const IV_LENGTH = 16; // AES block size

export function encrypt(text: string): string {
    // If no key provided in env, use default (ONLY FOR DEV)
    if (!process.env.ENCRYPTION_KEY && text) {
        console.warn("WARNING: Using default encryption key. Set ENCRYPTION_KEY in .env");
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
    if (!text) return '';
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
