/**
 * AES-256-CBC encryption compatible with OpenSSL EVP_BytesToKey.
 * Ported from Python auth.py AESCipher class.
 */
import { createHash, randomBytes } from 'node:crypto';
import { createCipheriv } from 'node:crypto';

const SALT_MAGIC = Buffer.from('Salted__', 'ascii');
const BLOCK_SIZE = 16;
const KEY_LENGTH = 32;

/**
 * Derive key and IV from password + salt using OpenSSL EVP_BytesToKey with MD5.
 */
function deriveKeyAndIv(
  password: Buffer,
  salt: Buffer,
  keyLength: number,
  ivLength: number,
): { key: Buffer; iv: Buffer } {
  let derived = Buffer.alloc(0);
  let block = Buffer.alloc(0);

  while (derived.length < keyLength + ivLength) {
    const input = Buffer.concat([block, password, salt]);
    block = createHash('md5').update(input).digest();
    derived = Buffer.concat([derived, block]);
  }

  return {
    key: derived.subarray(0, keyLength),
    iv: derived.subarray(keyLength, keyLength + ivLength),
  };
}

/**
 * Pad the input using PKCS7 padding.
 */
function pkcs7Pad(data: Buffer): Buffer {
  const padLen = BLOCK_SIZE - (data.length % BLOCK_SIZE);
  const padding = Buffer.alloc(padLen, padLen);
  return Buffer.concat([data, padding]);
}

/**
 * Encrypt text using AES-256-CBC with OpenSSL-compatible salted format.
 *
 * Output format: "Salted__" + 8-byte salt + ciphertext
 *
 * @param password - The passphrase bytes
 * @param text - The plaintext string to encrypt
 * @returns Buffer containing the encrypted data with salt header
 */
export function aesEncrypt(password: Buffer, text: string): Buffer {
  const salt = randomBytes(BLOCK_SIZE - SALT_MAGIC.length);
  const { key, iv } = deriveKeyAndIv(password, salt, KEY_LENGTH, BLOCK_SIZE);

  const cipher = createCipheriv('aes-256-cbc', key, iv);
  cipher.setAutoPadding(false);

  const padded = pkcs7Pad(Buffer.from(text, 'utf-8'));
  const ciphertext = Buffer.concat([cipher.update(padded), cipher.final()]);

  return Buffer.concat([SALT_MAGIC, salt, ciphertext]);
}
