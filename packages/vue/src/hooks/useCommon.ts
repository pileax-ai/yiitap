import { computed, inject } from 'vue'

export default function () {
  const commonDownload = (type: string, fileName: string, text: string) => {
    const options = {
      type: 'text/plain',
    }
    switch (type) {
      case 'svg':
        options.type = 'image/svg+xml;charset=utf-8'
        break
      default:
        break
    }
    const blob = new Blob([text], options)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const fileName = getFileNameFromUrl(imageUrl)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName

      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      window.open(imageUrl, '_blank')
    }
  }

  const getFileNameFromUrl = (url: string, defaultExt = 'png') => {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      const parts = pathname.split('/')
      const lastPart = parts[parts.length - 1]

      if (lastPart && lastPart.includes('.')) {
        return decodeURIComponent(lastPart)
      } else {
        return `image-${Date.now()}.${defaultExt}`
      }
    } catch (e) {
      return `download-${Date.now()}.${defaultExt}`
    }
  }

  return {
    commonDownload,
    downloadImage,
  }
}
