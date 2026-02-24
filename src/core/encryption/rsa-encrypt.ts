/**
 * RSA PKCS1v15 encryption for Synology API parameter encryption.
 * Ported from Python auth.py _encrypt_RSA method.
 */
import { publicEncrypt, constants } from 'node:crypto';

/**
 * Encrypt data using RSA with PKCS1 v1.5 padding.
 *
 * @param modulusHex - RSA modulus as a hex string
 * @param exponentHex - RSA public exponent as a hex string (typically "10001")
 * @param data - Data to encrypt (string or Buffer)
 * @returns Buffer containing the RSA-encrypted ciphertext
 */
export function rsaEncrypt(
  modulusHex: string,
  exponentHex: string,
  data: string | Buffer,
): Buffer {
  const modulus = BigInt(`0x${modulusHex}`);
  const exponent = BigInt(`0x${exponentHex}`);

  // Build DER-encoded RSAPublicKey
  const modulusBytes = bigintToUnsignedBytes(modulus);
  const exponentBytes = bigintToUnsignedBytes(exponent);

  const modulusDer = encodeAsn1Integer(modulusBytes);
  const exponentDer = encodeAsn1Integer(exponentBytes);

  const sequenceContent = Buffer.concat([modulusDer, exponentDer]);
  const rsaKeyDer = encodeAsn1Sequence(sequenceContent);

  // Wrap in SubjectPublicKeyInfo (PKCS#1 -> PKCS#8 wrapper)
  const algorithmId = Buffer.from([
    0x30, 0x0d, // SEQUENCE
    0x06, 0x09, // OID
    0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, // rsaEncryption
    0x05, 0x00, // NULL
  ]);

  const bitString = Buffer.concat([
    Buffer.from([0x03]),
    encodeAsn1Length(rsaKeyDer.length + 1),
    Buffer.from([0x00]), // no unused bits
    rsaKeyDer,
  ]);

  const spki = encodeAsn1Sequence(Buffer.concat([algorithmId, bitString]));

  const pem =
    '-----BEGIN PUBLIC KEY-----\n' +
    spki.toString('base64').match(/.{1,64}/g)!.join('\n') +
    '\n-----END PUBLIC KEY-----';

  const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;

  return publicEncrypt(
    { key: pem, padding: constants.RSA_PKCS1_PADDING },
    input,
  );
}

function bigintToUnsignedBytes(n: bigint): Buffer {
  if (n === 0n) return Buffer.from([0]);
  let hex = n.toString(16);
  if (hex.length % 2 !== 0) hex = '0' + hex;
  return Buffer.from(hex, 'hex');
}

function encodeAsn1Length(length: number): Buffer {
  if (length < 0x80) return Buffer.from([length]);
  if (length < 0x100) return Buffer.from([0x81, length]);
  return Buffer.from([0x82, (length >> 8) & 0xff, length & 0xff]);
}

function encodeAsn1Integer(bytes: Buffer): Buffer {
  // Prepend 0x00 if the high bit is set (to keep it positive)
  let content = bytes;
  if (bytes.length > 0 && (bytes[0]! & 0x80) !== 0) {
    content = Buffer.concat([Buffer.from([0x00]), bytes]);
  }
  return Buffer.concat([
    Buffer.from([0x02]), // INTEGER tag
    encodeAsn1Length(content.length),
    content,
  ]);
}

function encodeAsn1Sequence(content: Buffer): Buffer {
  return Buffer.concat([
    Buffer.from([0x30]), // SEQUENCE tag
    encodeAsn1Length(content.length),
    content,
  ]);
}
