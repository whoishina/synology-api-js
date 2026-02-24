/**
 * Parameter encryption combining RSA + AES for Synology login.
 * Ported from Python auth.py encrypt_params method.
 */
import { randomBytes } from 'node:crypto';
import { aesEncrypt } from './aes-cipher.ts';
import { rsaEncrypt } from './rsa-encrypt.ts';

const PASSPHRASE_CHARS =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()_+-/';

/**
 * Generate a random AES passphrase of the given length.
 */
function randomAesPassphrase(length: number): Buffer {
  const bytes = randomBytes(length);
  const result = Buffer.alloc(length);
  for (let i = 0; i < length; i++) {
    result[i] = PASSPHRASE_CHARS.charCodeAt(bytes[i]! % PASSPHRASE_CHARS.length);
  }
  return result;
}

/**
 * Encryption info returned by SYNO.API.Encryption.getinfo.
 */
export interface EncryptionInfo {
  readonly public_key: string;
  readonly cipherkey: string;
  readonly ciphertoken: string;
  readonly server_time: number;
}

/**
 * Encrypt login parameters using RSA + AES.
 *
 * 1. Generate a random AES passphrase (501 bytes)
 * 2. Add the cipher token to params
 * 3. RSA-encrypt the passphrase with the server's public key
 * 4. AES-encrypt the URL-encoded params with the passphrase
 * 5. Return { [cipherKey]: JSON({ rsa: base64, aes: base64 }) }
 *
 * @param params - The login parameters to encrypt
 * @param encInfo - Encryption info from SYNO.API.Encryption
 * @returns Encrypted params as a single-key record
 */
export function encryptParams(
  params: Record<string, string | number>,
  encInfo: EncryptionInfo,
): Record<string, string> {
  const passphrase = randomAesPassphrase(501);

  // Add cipher token with server time
  const paramsWithToken: Record<string, string | number> = {
    ...params,
    [encInfo.ciphertoken]: encInfo.server_time,
  };

  // URL-encode the params
  const urlEncoded = new URLSearchParams(
    Object.entries(paramsWithToken).map(([k, v]): [string, string] => [k, String(v)]),
  ).toString();

  // RSA-encrypt the passphrase
  const encryptedPassphrase = rsaEncrypt(
    encInfo.public_key,
    '10001',
    passphrase,
  );

  // AES-encrypt the URL-encoded params
  const encryptedParams = aesEncrypt(passphrase, urlEncoded);

  const encPayload = JSON.stringify({
    rsa: encryptedPassphrase.toString('base64'),
    aes: encryptedParams.toString('base64'),
  });

  return { [encInfo.cipherkey]: encPayload };
}
