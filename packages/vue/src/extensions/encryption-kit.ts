import {
  createExtension,
  type ExtensionName,
  type ExtensionOptions,
} from './factory'
import { EncryptionExtensionNames, type AnyExtension } from './extensions'

/**
 * Options for the custom StarterKit.
 * Allows users to pass configuration objects for each extension,
 * or set them to false to disable specific features.
 */
export type EncryptionKitOptions = {
  [K in ExtensionName]?: ExtensionOptions[K] | false
}

/**
 * EncryptionKit implementation
 * This function returns a flattened array of extensions based on your DefaultExtensionNames.
 */
export const OEncryptionKit = {
  /**
   * Configure and return the default suite of extensions
   */
  configure(options: EncryptionKitOptions = {}): AnyExtension[] {
    return EncryptionExtensionNames.flatMap((name) => {
      const userConfig = options[name as ExtensionName]

      // Skip if explicitly disabled
      if (userConfig === false) {
        return []
      }

      // Create instance (using undefined if userConfig is not a custom object)
      const configure = typeof userConfig === 'object' ? userConfig : undefined
      const result = createExtension({
        name: name as ExtensionName,
        configure,
      })

      return result ?? []
    })
  },
}
