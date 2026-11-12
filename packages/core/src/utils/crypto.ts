// ------------------------------------------------------------
// Master Password
// ------------------------------------------------------------
const MASTER_PASSWORD_VERIFY_TOKEN = 'DOC_MASTER_PASSWORD_VERIFY_TOKEN'
const SALT_BYTES = 16
const IV_BYTES = 12
const STANDARD_BASE64_RE = /^[A-Za-z0-9+/]*={0,2}$/

export const CurrentEncryptionVersion = 'v1'
export type EncryptionVersion = 'v1' | 'v2'
export type KdfName = 'PBKDF2'
export type KdfHash = 'SHA-256' | 'SHA-512'
export interface EncryptionProfile {
  readonly version: EncryptionVersion
  readonly kdf: {
    name: KdfName
    hash: KdfHash
    iterations: number
  }
}

export const PROFILES: Record<EncryptionVersion, EncryptionProfile> = {
  v1: Object.freeze({
    version: 'v1',
    kdf: Object.freeze({ name: 'PBKDF2', hash: 'SHA-256', iterations: 600_000 }),
  }),
  v2: Object.freeze({
    version: 'v2',
    kdf: Object.freeze({ name: 'PBKDF2', hash: 'SHA-256', iterations: 1_000_000 }),
  }),
}

export interface MasterPasswordMeta {
  version: EncryptionVersion
  salt: number[]
  ciphertext: string
  iv: number[]
}

export interface MasterPasswordSetupResult {
  version: EncryptionVersion
  salt: number[]
  ciphertext: string
  iv: number[]
  key: CryptoKey
}

export class DataCorruptError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DataCorruptError'
  }
}

export type VerifyMasterPasswordResult =
  | { ok: true; key: CryptoKey }
  | { ok: false; reason: 'PASSWORD_INVALID' }

export function getEncryptionProfile(version: EncryptionVersion): EncryptionProfile {
  if (!Object.prototype.hasOwnProperty.call(PROFILES, version)) {
    throw new Error(`Unsupported encryption version: ${version}`)
  }
  return PROFILES[version as EncryptionVersion]
}

/**
 * Initialize a new document master password.
 * Generates a fresh salt, derives the CryptoKey, and encrypts a verification token.
 */
export async function setupMasterPassword(version: EncryptionVersion, password: string): Promise<MasterPasswordSetupResult> {
  const salt = generateSalt()
  const key = await deriveKeyFromPassword(version, password, salt)

  // Encrypt a known verification string to check password correctness later
  const encrypted = await encryptText(MASTER_PASSWORD_VERIFY_TOKEN, key)

  return {
    version,
    salt: Array.from(salt),
    ciphertext: encrypted.ciphertext,
    iv: encrypted.iv,
    key,
  }
}

function assertValidVerifyMeta(meta: MasterPasswordMeta): void {
  if (!Array.isArray(meta.salt) || meta.salt.length !== SALT_BYTES) {
    throw new DataCorruptError('masterSalt must be 16 bytes')
  }
  if (!Array.isArray(meta.iv) || meta.iv.length !== IV_BYTES) {
    throw new DataCorruptError('masterVerifyIv must be 12 bytes')
  }
  if (typeof meta.ciphertext !== 'string' || !isValidStandardBase64(meta.ciphertext)) {
    throw new DataCorruptError('masterVerifyCipher is not valid base64')
  }
  if (!Object.prototype.hasOwnProperty.call(PROFILES, meta.version)) {
    throw new DataCorruptError(`Unsupported encryption version: ${meta.version}`)
  }
}

/**
 * Verify an input password against the stored salt and verification ciphertext.
 * Returns the derived CryptoKey if successful
 */
export async function verifyMasterPassword(
  password: string,
  meta: MasterPasswordMeta,
): Promise<VerifyMasterPasswordResult> {
  assertValidVerifyMeta(meta)

  const salt = new Uint8Array(meta.salt)
  const key = await deriveKeyFromPassword(meta.version, password, salt)

  let decrypted: string
  try {
    decrypted = await decryptText(meta.ciphertext, meta.iv, key)
  } catch {
    // GCM tag verification failed: wrong key (incorrect password) or tampered ciphertext/IV
    return { ok: false, reason: 'PASSWORD_INVALID' }
  }

  if (decrypted !== MASTER_PASSWORD_VERIFY_TOKEN) {
    // GCM authentication passed but plaintext does not match
    throw new DataCorruptError('Master password verify token mismatch')
  }

  return { ok: true, key }
}

/**
 * Re-encrypt all existing encrypted blocks or update master password metadata.
 * Useful when the user wants to change the master password.
 */
export async function changeMasterPassword(
  version: EncryptionVersion,
  newPassword: string
): Promise<MasterPasswordSetupResult> {
  // Simply runs the setup logic again with a fresh salt and new key
  return await setupMasterPassword(version, newPassword)
}

// ------------------------------------------------------------
// Encrypt, decrypt
// ------------------------------------------------------------
export async function deriveKeyFromPassword(
  version: EncryptionVersion,
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const profile = getEncryptionProfile(version)
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)

  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: profile.kdf.name },
    false,
    ['deriveKey']
  )

  // Explicitly cast salt to BufferSource / ArrayBufferView to satisfy strict TS DOM types
  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      salt: salt as unknown as Uint8Array<ArrayBuffer>,
      name: profile.kdf.name,
      iterations: profile.kdf.iterations,
      hash: profile.kdf.hash,
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )

  return derivedKey
}

export function generateSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(16))
}

export function generateIv(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(12))
}

export async function encryptText(text: string, key: CryptoKey): Promise<{ ciphertext: string; iv: number[] }> {
  const iv = generateIv()
  const encoded = new TextEncoder().encode(text)
  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as unknown as Uint8Array<ArrayBuffer> },
    key,
    encoded
  )
  return {
    ciphertext: bufferToBase64(cipherBuffer),
    iv: Array.from(iv),
  }
}

export async function decryptText(base64Cipher: string, ivArray: number[], key: CryptoKey): Promise<string> {
  const iv = new Uint8Array(ivArray)
  const cipherBuffer = base64ToBuffer(base64Cipher)
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as unknown as Uint8Array<ArrayBuffer> },
    key,
    cipherBuffer as unknown as Uint8Array<ArrayBuffer>
  )
  return new TextDecoder().decode(decryptedBuffer)
}

function isValidStandardBase64(s: string): boolean {
  return s.length > 0 && s.length % 4 === 0 && STANDARD_BASE64_RE.test(s)
}

// ------------------------------------------------------------
// Base64
// ------------------------------------------------------------
export function encodeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str)
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('')
  // Convert standard base64 to base64url: no +, /, or = padding.
  return btoa(binString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeBase64(base64Str: string): string {
  // Normalize base64url back to standard base64 before atob.
  const normalized = base64Str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  const binString = atob(padded)
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!)
  return new TextDecoder().decode(bytes)
}

// Convert ArrayBuffer / Uint8Array to Base64
export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// Convert Base64 to Uint8Array
export function base64ToBuffer(base64: string): Uint8Array {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

export function arrayToBase64(arr: number[]) {
  return bufferToBase64(new Uint8Array(arr).buffer)
}
