import axios from 'axios'

function getReferer(url: string): string {
  try {
    const u = new URL(url)
    return `${u.protocol}//${u.host}/`
  } catch {
    return 'https://nekolions.my.id/'
  }
}

function isManifestRequest(url: string, contentType: string): boolean {
  return /m3u8|vtt/i.test(contentType) || /\.(?:m3u8|txt|vtt)$/i.test(url)
}

function proxyBaseUrl(event: any): string {
  const host = event.node.req.headers.host || 'localhost:3000'
  const proto = event.node.req.headers['x-forwarded-proto'] || 'http'
  return `${proto}://${host}`
}

function rewriteManifest(manifest: string, baseUrl: string, proxyBase: string): string {
  const baseDir = baseUrl.replace(/\/+[^/]*$/, '/')
  const proxyPrefix = `${proxyBase.replace(/\/+$/, '')}/api/proxy/hls?url=`

  const lines = manifest.split('\n')
  const rewritten = lines.map(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('<')) return line
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed.replace(trimmed, `${proxyPrefix}${encodeURIComponent(trimmed)}`)
    }
    if (trimmed.startsWith('//')) {
      return trimmed.replace(trimmed, `${proxyPrefix}${encodeURIComponent('https:' + trimmed)}`)
    }
    const fullUrl = baseDir + trimmed
    return trimmed.replace(trimmed, `${proxyPrefix}${encodeURIComponent(fullUrl)}`)
  })
  return rewritten.join('\n')
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    throw createError({ statusCode: 400, message: 'URL diperlukan' })
  }

  try {
    const referer = (query.referer as string) || getReferer(url)
    const isManifest = isManifestRequest(url, '')

    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': isManifest ? '*/*' : '*/*',
        'Accept-Language': 'id-ID,id;q=0.9',
        'Referer': referer,
        'Origin': referer.replace(/\/+$/, ''),
      },
      responseType: isManifest ? 'text' : 'arraybuffer',
      timeout: 20000,
      maxRedirects: 5,
      validateStatus: () => true,
    })

    if (res.status >= 400) {
      setResponseStatus(event, 502)
      return { error: true, status: res.status, message: `CDN returned ${res.status} for ${url.slice(0, 80)}...` }
    }

    const contentType = res.headers['content-type'] || (isManifest ? 'application/vnd.apple.mpegurl' : 'application/octet-stream')
    const isManifestResp = isManifestRequest(url, contentType)

    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Cache-Control': isManifestResp ? 'no-cache' : 'public, max-age=3600',
    })

    if (isManifestResp) {
      setResponseHeader(event, 'Content-Type', 'application/vnd.apple.mpegurl; charset=utf-8')
      const base = proxyBaseUrl(event)
      return rewriteManifest(res.data as string, url, base)
    }

    setResponseHeader(event, 'Content-Type', contentType)
    return Buffer.from(res.data as ArrayBuffer)
  } catch (e: any) {
    throw createError({ statusCode: 502, message: `Gagal memuat HLS: ${e.message}` })
  }
})
