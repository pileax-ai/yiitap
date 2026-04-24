export const reduceType = (mimeType: string) => {
  if (mimeType.startsWith('audio')) {
    return 'audio'
  } else if (mimeType.startsWith('image')) {
    return 'image'
  } else if (mimeType.startsWith('model')) {
    return 'modelViewer'
  } else if (mimeType.startsWith('video')) {
    return 'video'
  } else {
    return mimeType
  }
}

export const reduceTypeByFile = (file: File) => {
  return reduceType(file.type)
}

export const generateId = (): string => {
  // Check if the browser supports the native UUID API and is in a secure context
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }

  // Fallback to manual UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
