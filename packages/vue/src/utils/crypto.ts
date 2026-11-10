// --- Crypto Utility Functions ---

// ------------------------------------------------------------
// Key
// ------------------------------------------------------------
let activeMasterKey: CryptoKey | null = null

export function getActiveMasterKey(): CryptoKey | null {
  return activeMasterKey
}

export function setActiveMasterKey(key: CryptoKey | null) {
  activeMasterKey = key
}

export function clearActiveMasterKey() {
  activeMasterKey = null
}

// ------------------------------------------------------------
// Master Password
// ------------------------------------------------------------
/**
 * Initialize a new document master password.
 * Generates a fresh salt, derives the CryptoKey, and encrypts a verification token.
 */
export async function setupMasterPassword(password: string): Promise<MasterPasswordSetupResult> {
  const salt = generateSalt()
  const key = await deriveKeyFromPassword(password, salt)

  // Encrypt a known verification string to check password correctness later
  const verifyToken = 'DOC_MASTER_PASSWORD_VERIFY_TOKEN'
  const encrypted = await encryptText(verifyToken, key)

  return {
    salt: Array.from(salt),
    masterVerifyCipher: encrypted.ciphertext,
    masterVerifyIv: encrypted.iv,
    key,
  }
}

/**
 * Verify an input password against the stored salt and verification ciphertext.
 * Returns the derived CryptoKey if successful, or null if verification fails.
 */
export async function verifyMasterPassword(
  password: string,
  saltArray: number[],
  verifyCipher: string,
  verifyIv: number[]
): Promise<CryptoKey | null> {
  try {
    const salt = new Uint8Array(saltArray)
    const key = await deriveKeyFromPassword(password, salt)

    const decrypted = await decryptText(verifyCipher, verifyIv, key)
    if (decrypted === 'DOC_MASTER_PASSWORD_VERIFY_TOKEN') {
      return key
    }

    // Token not match
    return null
  } catch (err) {
    throw new Error('Password or iv/ciphertext is invalid')
  }
}

/**
 * Re-encrypt all existing encrypted blocks or update master password metadata.
 * Useful when the user wants to change the master password.
 */
export async function changeMasterPassword(
  newPassword: string
): Promise<MasterPasswordSetupResult> {
  // Simply runs the setup logic again with a fresh salt and new key
  return await setupMasterPassword(newPassword)
}

// ------------------------------------------------------------
// Encrypt, decrypt
// ------------------------------------------------------------
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array,
  iterations: number = 100000
): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)

  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  // Explicitly cast salt to BufferSource / ArrayBufferView to satisfy strict TS DOM types
  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as Uint8Array<ArrayBuffer>,
      iterations: iterations,
      hash: 'SHA-256',
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

// --- Master Password Management Methods ---

export interface MasterPasswordSetupResult {
  salt: number[]
  masterVerifyCipher: string
  masterVerifyIv: number[]
  key: CryptoKey
}
