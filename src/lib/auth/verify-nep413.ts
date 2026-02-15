/**
 * NEP-413 signature verification without @near-wallet-selector dependency.
 * Uses near-api-js PublicKey.verify() for ed25519 signature checking.
 */
import { serialize, Schema } from 'borsh';

// NEP-413 payload schema for borsh serialization
const Nep413PayloadSchema: Schema = {
  struct: {
    tag: 'u32',
    message: 'string',
    nonce: { array: { type: 'u8', len: 32 } },
    recipient: 'string',
  },
};

// NEP-413 tag: 2**31 + 413 = 2147484061
const NEP413_TAG = 2147484061;

interface VerifySignatureParams {
  publicKey: string;
  signature: string;
  message: string;
  nonce: Buffer | Uint8Array;
  recipient: string;
}

export function verifySignature({
  publicKey,
  signature,
  message,
  nonce,
  recipient,
}: VerifySignatureParams): boolean {
  try {
    // Dynamic import to avoid issues with ESM/CJS
    // PublicKey from near-api-js handles ed25519 verification
    const { PublicKey } = require('near-api-js/lib/crypto/public_key.js');

    const pk = PublicKey.from(publicKey);

    // Serialize NEP-413 payload using borsh
    const nonceArray = Array.from(new Uint8Array(nonce));
    const payload = {
      tag: NEP413_TAG,
      message,
      nonce: nonceArray,
      recipient,
    };

    const serializedPayload = serialize(Nep413PayloadSchema, payload);

    // Decode base64 signature
    const signatureBytes = Buffer.from(signature, 'base64');

    return pk.verify(serializedPayload, signatureBytes);
  } catch (err) {
    console.error('[NEP-413] Signature verification failed:', err);
    return false;
  }
}
