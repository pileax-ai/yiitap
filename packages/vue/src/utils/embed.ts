export const reduceUrlMeta = (url: string): Indexable => {
  // Normalize URL by removing query strings and fragments
  const cleanUrl = url.split(/[?#]/)[0].toLowerCase()

  // Audio Patterns
  const audioExtensions = /\.(mp3|wav|ogg|m4a|flac|aac)$/i
  if (audioExtensions.test(cleanUrl)) {
    return {
      type: 'audio',
      url: url,
    }
  }

  // Image Patterns
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)$/i
  if (imageExtensions.test(cleanUrl) || url.includes('image-process')) {
    return {
      type: 'image',
      url: url,
    }
  }

  // Video Patterns
  const videoExtensions = /\.(mp4|webm|ogg|mov|m4v)$/i
  if (videoExtensions.test(cleanUrl)) {
    return {
      type: 'video',
      url: url,
    }
  }

  // Model (model-viewer) Patterns
  // model-viewer typically supports .glb and .gltf
  const modelExtensions = /\.(glb|gltf)$/i
  if (modelExtensions.test(cleanUrl)) {
    return {
      type: 'modelViewer',
      url: url,
    }
  }

  // Embed
  return {
    type: 'embed',
    url: transformToEmbedUrl(url),
  }
}

/**
 * Transform standard URLs to iframe-compatible embed URLs
 * @param url The raw URL from browser address bar
 * @returns The converted embed URL or original URL if no match
 */
export const transformToEmbedUrl = (url: string): string => {
  if (!url) return ''

  // YouTube
  const youtubeReg =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const youtubeMatch = url.match(youtubeReg)

  if (youtubeMatch && youtubeMatch[2].length === 11) {
    const videoId = youtubeMatch[2]
    return `https://www.youtube.com/embed/${videoId}`
  }

  // Google Maps
  // if (url.includes('google.com/maps')) {
  //   if (url.includes('/place/')) {
  //     return url.replace('/maps/place/', '/maps/embed/place/')
  //   }
  //   return url.replace('/maps/', '/maps/embed/')
  // }

  // Vimeo
  const vimeoRegExp = /vimeo\.com\/(?:video\/)?(\d+)/
  const vimeoMatch = url.match(vimeoRegExp)

  if (vimeoMatch) {
    const vimeoId = vimeoMatch[1]
    return `https://player.vimeo.com/video/${vimeoId}`
  }

  // X (Twitter)
  // Pattern: x.com/user/status/123 or twitter.com/user/status/123
  const tweetReg = /(?:x|twitter)\.com\/.+\/status\/(\d+)/
  const tweetMatch = url.match(tweetReg)
  if (tweetMatch) {
    return `https://platform.twitter.com/embed/Tweet.html?id=${tweetMatch[1]}`
  }

  // CodePen
  const codepenReg =
    /codepen\.io\/([^/]+)\/(?:pen|details|full)\/([a-zA-Z0-9]+)/
  const codepenMatch = url.match(codepenReg)
  if (codepenMatch) {
    const user = codepenMatch[1]
    const penId = codepenMatch[2]
    return `https://codepen.io/${user}/embed/${penId}?default-tab=result`
  }

  // Bilibili
  const biliReg = /bilibili\.com\/video\/(av\d+|BV[a-zA-Z0-9]+)/
  const biliMatch = url.match(biliReg)
  if (biliMatch) {
    const id = biliMatch[1]
    const param = id.startsWith('BV') ? 'bvid' : 'aid'
    return `https://player.bilibili.com/player.html?${param}=${id}&high_quality=1&autoplay=0`
  }

  // Youku
  const youkuReg = /v\.youku\.com\/v_show\/id_([a-zA-Z0-9==]+)/
  const youkuMatch = url.match(youkuReg)
  if (youkuMatch) {
    return `https://player.youku.com/embed/${youkuMatch[1]}`
  }

  // Tencent Video (v.qq.com)
  const tencentReg =
    /v\.qq\.com\/x\/cover\/.*\/([a-zA-Z0-9]+)\.html|v\.qq\.com\/page\/([a-zA-Z0-9]+)\.html/
  const tenMatch = url.match(tencentReg)
  if (tenMatch) {
    const vid = tenMatch[1] || tenMatch[2]
    return `https://v.qq.com/txp/iframe/player.html?vid=${vid}`
  }

  // Amap (AutoNavi)
  const amapReg = /amap\.com\/search\?query=([^&]+)/
  const amapMatch = url.match(amapReg)
  if (amapMatch) {
    return `https://m.amap.com/search/view/keywords=${amapMatch[1]}`
  }

  return url
}
