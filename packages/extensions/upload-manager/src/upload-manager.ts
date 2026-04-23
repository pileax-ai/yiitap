import { Extension } from '@tiptap/core'

export interface UploadManagerOptions {
  onUpload?: (file: File, type: string) => Promise<string>
}

export interface UploadManagerStorage {
  onUpload?: (file: File, type: string) => Promise<string>
}

export const UploadManager = Extension.create<
  UploadManagerOptions,
  UploadManagerStorage
>({
  name: 'uploadManager',

  addOptions() {
    return {
      onUpload: undefined,
    } as UploadManagerOptions
  },

  addStorage() {
    return {
      onUpload: undefined,
    }
  },

  onBeforeCreate() {
    this.storage.onUpload = this.options.onUpload
  },

  onUpdate() {
    this.storage.onUpload = this.options.onUpload
  },
})
