import { Editor } from '@tiptap/core'
import { Node as PMNode } from '@tiptap/pm/model'
import type { EditorState } from '@tiptap/pm/state'
import {
  DataCorruptError,
  decodeBase64, decryptText,
  EncryptionVersion, encryptText,
  MasterPasswordMeta,
  setupMasterPassword,
  verifyMasterPassword
} from '@yiitap/core'

export const ENCRYPTED_BLOCK_NODE = 'encryptedBlock'
export const ENCRYPTION_META_NODE = 'encryptionMeta'

export interface EncryptionMetaOptions {
  version: string | null
  tips: string | null
  salt: number[] | null
  ciphertext: string | null
  iv: number[] | null
}

/**
 * Internal helper: locate the meta node in the document
 * @param doc Document
 */
export function findMetaNode(doc: PMNode): { node: PMNode; pos: number } | null {
  // Fast path: meta is normally the first child
  const first = doc.firstChild
  if (first && first.type.name === ENCRYPTION_META_NODE) {
    return { node: first, pos: 0 }
  }
  // Fallback: full traversal for abnormal states
  let result: { node: PMNode; pos: number } | null = null
  doc.descendants((node, pos) => {
    if (node.type.name === ENCRYPTION_META_NODE) {
      result = { node, pos }
      return false
    }
  })
  return result
}

/**
 * Public helper: read the current encryption metadata
 * @param state Editor State
 */
export function getEncryptionMeta(state: EditorState): EncryptionMetaOptions | null {
  const first = state.doc.firstChild
  if (!first || first.type.name !== ENCRYPTION_META_NODE) return null
  return first.attrs as EncryptionMetaOptions
}

export async function changeMasterPassword(
  editor: Editor,
  newVersion: EncryptionVersion,
  oldPassword: string,
  newPassword: string,
  newPasswordTips: string,
): Promise<CryptoKey> {
  const { state, view } = editor

  // 1. Read current meta
  const first = state.doc.firstChild
  if (!first || first.type.name !== ENCRYPTION_META_NODE) {
    throw new DataCorruptError('EncryptionMeta node missing')
  }
  const currentMeta = first.attrs as MasterPasswordMeta

  // 2. Verify oldPassword and get key
  const oldResult = await verifyMasterPassword(oldPassword, currentMeta)
  if (!oldResult.ok) {
    throw new Error('OLD_PASSWORD_INVALID')
  }

  // 3. Generate new meta and key
  const newSetup = await setupMasterPassword(newVersion, newPassword)

  // 4. Collect all encryptedBlock
  const blocks: Array<{ pos: number; attrs: Record<string, unknown> }> = []
  state.doc.descendants((node, pos) => {
    if (node.type.name === ENCRYPTED_BLOCK_NODE && node.attrs.ciphertext) {
      blocks.push({ pos, attrs: { ...node.attrs } })
    }
    return true
  })

  // 5. Reencryption
  const reEncrypted = await Promise.all(
    blocks.map(async ({ pos, attrs }) => {
      const plain = await decryptText(attrs.ciphertext as string, attrs.iv as number[], oldResult.key)
      const enc = await encryptText(plain, newSetup.key)  // 内部生成新 IV
      return { pos, attrs: { ...attrs, ciphertext: enc.ciphertext, iv: enc.iv } }
    }),
  )

  // 6. Commit transaction
  const tr = state.tr
  tr.setNodeMarkup(0, undefined, {
    version: newSetup.version,
    tips: newPasswordTips,
    salt: newSetup.salt,
    ciphertext: newSetup.ciphertext,
    iv: newSetup.iv,
  })
  for (const { pos, attrs } of reEncrypted) {
    tr.setNodeMarkup(pos, undefined, attrs)
  }
  view.dispatch(tr)

  return newSetup.key
}

export function parseEncryptionMeta(raw: string | null) {
  if (!raw) return false

  // Try base64url first (new format), then plain JSON (backward compatibility)
  const tryParse = (text: string) => {
    try {
      const attrs = JSON.parse(text)
      return {
        version: attrs.version ?? null,
        salt: attrs.salt ?? null,
        tips: attrs.tips ?? null,
        ciphertext: attrs.ciphertext ?? null,
        iv: attrs.iv ?? null,
      }
    } catch {
      return null
    }
  }

  // New format: base64-encoded JSON
  try {
    const decoded = tryParse(decodeBase64(raw))
    if (decoded) return decoded
  } catch {
    // Not valid base64 — fall through to legacy format
  }

  // Legacy format: raw JSON string
  return tryParse(raw) ?? false
}

export function parseEncryptedBlock(raw: string | null) {
  if (!raw) return null

  const tryParse = (text: string) => {
    try {
      const attrs = JSON.parse(text)
      if (!attrs || typeof attrs !== 'object') return null
      return {
        ciphertext: typeof attrs.ciphertext === 'string' ? attrs.ciphertext : '',
        iv: Array.isArray(attrs.iv) ? attrs.iv : [],
      }
    } catch {
      return null
    }
  }

  // New format: base64url-encoded JSON
  try {
    const decoded = tryParse(decodeBase64(raw))
    if (decoded) return decoded
  } catch {
    // Not valid base64 — fall through to legacy format
  }

  // Legacy format: raw JSON string
  return tryParse(raw)
}
