/**
 * Noise IK handshake for DSM 7+ authentication.
 * Uses Noise_IK_25519_ChaChaPoly_BLAKE2b protocol.
 *
 * Ported from Python auth.py get_ik_message method.
 * Uses @noble/curves for X25519, @noble/ciphers for ChaCha20-Poly1305,
 * and @noble/hashes for BLAKE2b.
 */
import { x25519 } from '@noble/curves/ed25519';
import { chacha20poly1305 } from '@noble/ciphers/chacha';
import { blake2b } from '@noble/hashes/blake2b';

// Noise protocol constants
const EMPTY = new Uint8Array(0);
const PROTOCOL_NAME = 'Noise_IK_25519_ChaChaPoly_BLAKE2b';

/**
 * Decode a URL-safe base64 SSID cookie value to bytes.
 */
export function decodeSsidCookie(ssid: string): Uint8Array {
  let fixed = ssid.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (fixed.length % 4)) % 4;
  fixed += '='.repeat(padLen);
  const binary = atob(fixed);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encode bytes to a URL-safe base64 string (no padding).
 */
export function encodeSsidCookie(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  let b64 = btoa(binary);
  b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return b64;
}

/**
 * HMAC-BLAKE2b used as the Noise protocol hash function.
 */
function hmacBlake2b(key: Uint8Array, data: Uint8Array): Uint8Array {
  const blockSize = 128;
  let k = key;
  if (k.length > blockSize) {
    k = blake2b(k, { dkLen: 64 });
  }
  const paddedKey = new Uint8Array(blockSize);
  paddedKey.set(k);

  const ipad = new Uint8Array(blockSize);
  const opad = new Uint8Array(blockSize);
  for (let i = 0; i < blockSize; i++) {
    ipad[i] = paddedKey[i]! ^ 0x36;
    opad[i] = paddedKey[i]! ^ 0x5c;
  }

  const inner = blake2b(concatBytes(ipad, data), { dkLen: 64 });
  return blake2b(concatBytes(opad, inner), { dkLen: 64 });
}

/**
 * HKDF using BLAKE2b as the hash function for Noise.
 */
function hkdfBlake2b(
  chainingKey: Uint8Array,
  inputKeyMaterial: Uint8Array,
  numOutputs: 2 | 3,
): Uint8Array[] {
  const tempKey = hmacBlake2b(chainingKey, inputKeyMaterial);
  const output1 = hmacBlake2b(tempKey, new Uint8Array([1]));
  const output2 = hmacBlake2b(tempKey, concatBytes(output1, new Uint8Array([2])));

  if (numOutputs === 2) return [output1, output2];

  const output3 = hmacBlake2b(tempKey, concatBytes(output2, new Uint8Array([3])));
  return [output1, output2, output3];
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

/**
 * Encrypt plaintext using ChaCha20-Poly1305 with a Noise-style nonce.
 */
function encryptWithAd(
  key: Uint8Array,
  nonce: bigint,
  ad: Uint8Array,
  plaintext: Uint8Array,
): Uint8Array {
  const nonceBytes = new Uint8Array(12);
  // Little-endian 64-bit nonce at offset 4
  const view = new DataView(nonceBytes.buffer);
  view.setUint32(4, Number(nonce & 0xffffffffn), true);
  view.setUint32(8, Number((nonce >> 32n) & 0xffffffffn), true);

  const cipher = chacha20poly1305(key.subarray(0, 32), nonceBytes, ad);
  return cipher.encrypt(plaintext);
}

/**
 * Perform the Noise IK handshake as initiator and produce the encrypted message.
 *
 * @param serverPublicKey - The server's static public key (decoded SSID cookie)
 * @param payload - The JSON payload to encrypt (e.g. { time: timestamp })
 * @returns The encrypted handshake message
 */
export function noiseIkHandshake(
  serverPublicKey: Uint8Array,
  payload: Uint8Array,
): Uint8Array {
  const hashLen = 64;

  // Initialize symmetric state
  const protocolBytes = new TextEncoder().encode(PROTOCOL_NAME);
  let h: Uint8Array;
  if (protocolBytes.length <= hashLen) {
    h = new Uint8Array(hashLen);
    h.set(protocolBytes);
  } else {
    h = blake2b(protocolBytes, { dkLen: hashLen });
  }
  let ck: Uint8Array<ArrayBufferLike> = new Uint8Array(h);

  // MixHash helper
  function mixHash(data: Uint8Array): void {
    h = blake2b(concatBytes(h, data), { dkLen: hashLen });
  }

  // MixKey helper
  function mixKey(inputKeyMaterial: Uint8Array): Uint8Array {
    const [newCk, tempK] = hkdfBlake2b(ck, inputKeyMaterial, 2) as [Uint8Array, Uint8Array];
    ck = newCk;
    return tempK;
  }

  // Prologue
  mixHash(EMPTY);

  // IK pattern: initiator knows responder's static key
  // pre-message: <- s
  mixHash(serverPublicKey);

  // -> e, es, s, ss
  // Generate ephemeral keypair
  const ephemeralPrivate = x25519.utils.randomPrivateKey();
  const ephemeralPublic = x25519.getPublicKey(ephemeralPrivate);

  // -> e: send ephemeral public key
  mixHash(ephemeralPublic);

  // -> es: DH(e, rs)
  const dhEs = x25519.getSharedSecret(ephemeralPrivate, serverPublicKey);
  let k = mixKey(dhEs);
  let nonce = 0n;

  // -> s: encrypt our static public key
  const staticPrivate = x25519.utils.randomPrivateKey();
  const staticPublic = x25519.getPublicKey(staticPrivate);
  const encryptedStatic = encryptWithAd(k, nonce, h, staticPublic);
  nonce++;
  mixHash(encryptedStatic);

  // -> ss: DH(s, rs)
  const dhSs = x25519.getSharedSecret(staticPrivate, serverPublicKey);
  k = mixKey(dhSs);
  nonce = 0n;

  // Encrypt payload
  const encryptedPayload = encryptWithAd(k, nonce, h, payload);

  // Compose the message: ephemeral_public + encrypted_static + encrypted_payload
  return concatBytes(ephemeralPublic, encryptedStatic, encryptedPayload);
}
