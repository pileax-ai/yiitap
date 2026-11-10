import { Extension } from '@tiptap/core'

export interface EncryptionMetadataOptions {
  // Optional extension settings if needed
}

declare module '@tiptap/core' {
  interface Storage {
    encryptionMetadata: {
      masterKey: CryptoKey | null
    }
  }

  interface Commands<ReturnType> {
    encryptionMetadata: {
      /** Set or update document master password metadata */
      setMasterPasswordMeta: (meta: {
        masterSalt: number[]
        masterVerifyCipher: string
        masterVerifyIv: number[]
      }) => ReturnType
    }
  }
}

export const EncryptionMetadata = Extension.create<EncryptionMetadataOptions>({
  name: 'encryptionMetadata',

  // 1. Cache key to storage
  addStorage() {
    return {
      activeMasterKey: null,
    }
  },

  // 1. Extend global attributes for the 'doc' node
  addGlobalAttributes() {
    return [
      {
        types: ['doc'],
        attributes: {
          masterSalt: {
            default: null,
            parseHTML: (element) => {
              const val = element.getAttribute('data-master-salt')
              return val ? JSON.parse(val) : null
            },
            renderHTML: (attributes) => {
              if (!attributes.masterSalt) return {}
              return {
                'data-master-salt': JSON.stringify(attributes.masterSalt),
              }
            },
          },
          masterVerifyCipher: {
            default: null,
            parseHTML: (element) => element.getAttribute('data-master-verify-cipher') || null,
            renderHTML: (attributes) => {
              if (!attributes.masterVerifyCipher) return {}
              return {
                'data-master-verify-cipher': attributes.masterVerifyCipher,
              }
            },
          },
          masterVerifyIv: {
            default: null,
            parseHTML: (element) => {
              const val = element.getAttribute('data-master-verify-iv')
              return val ? JSON.parse(val) : null
            },
            renderHTML: (attributes) => {
              if (!attributes.masterVerifyIv) return {}
              return {
                'data-master-verify-iv': JSON.stringify(attributes.masterVerifyIv),
              }
            },
          },
        },
      },
    ]
  },

  // 2. Add commands to conveniently update master password metadata in document attrs
  addCommands() {
    return {
      setMasterPasswordMeta:
        (meta) =>
          ({ state, dispatch }) => {
            if (!dispatch) return true

            const tr = state.tr
              .setDocAttribute('masterSalt', meta.masterSalt)
              .setDocAttribute('masterVerifyCipher', meta.masterVerifyCipher)
              .setDocAttribute('masterVerifyIv', meta.masterVerifyIv)

            dispatch(tr)
            return true
          },
    }
  },
})
