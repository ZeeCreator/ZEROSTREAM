import axios from 'axios'

function decodeBase64(str: string): string {
  try {
    const cleaned = str.replace(/\s/g, '')
    if (!/^[A-Za-z0-9+/=]+$/.test(cleaned) || cleaned.length < 10) return ''
    const decoded = Buffer.from(cleaned, 'base64').toString('utf-8')
    if (decoded.includes('�') || decoded.charCodeAt(0) > 127) return ''
    return decoded
  } catch {
    return ''
  }
}

function decodeHex(str: string): string {
  try {
    if (!/^[0-9a-fA-F]+$/.test(str.trim())) return ''
    let out = ''
    for (let i = 0; i < str.length; i += 2) {
      out += String.fromCharCode(parseInt(str.substring(i, i + 2), 16))
    }
    return out
  } catch {
    return ''
  }
}

function decodeUriComponent(str: string): string {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '))
  } catch {
    return str
  }
}

function unpackJsPacker(text: string): string | null {
  const match = text.match(
    /eval\s*\(\s*function\s*\(p,a,c,k,e,d\)\{[\s\S]*?return\s+p\}\s*\('((?:[^'\\]|\\.)*)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^'\\]|\\.)*)'\s*\.\s*split\s*\(\s*['"][|]\s*['"]\s*\)(?:\s*,\s*\{\s*\})?\s*\)\s*\)/
  )
  if (!match) return null

  const payload = match[1].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\')
  const a = parseInt(match[2])
  const c = parseInt(match[3])
  const raw = match[4].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\')
  const k = raw.split('|')

  const eFn = (code: number): string => {
    const quot = Math.floor(code / a)
    const rem = code % a
    let result = ''
    if (quot > 0) result += eFn(quot)
    result += rem > 35 ? String.fromCharCode(rem + 29) : rem.toString(36)
    return result
  }

  let result = payload
  for (let i = 0; i < c; i++) {
    if (k[i]) {
      const word = eFn(i)
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      result = result.replace(new RegExp('\\b' + escaped + '\\b', 'g'), k[i])
    }
  }

  return result
}

function findAllUrls(text: string): string[] {
  const urls: string[] = []
  const patterns = [
    /https?:\/\/[^"'\s<>)\]]+/g,
    /\/\/[^"'\s<>)\]]+\.(?:m3u8|mp4)[^"'\s<>)\]]*/g,
  ]
  for (const pat of patterns) {
    const matches = text.match(pat)
    if (matches) urls.push(...matches)
  }
  return urls
}

function findVideoUrls(urls: string[]): string[] {
  return urls.filter(u => {
    try {
      return /\.(?:m3u8|mp4)(?:\?|$)/i.test(u) ||
        /\/master\.txt(?:\?|$)/i.test(u) ||
        /\/(?:index|playlist|media)\.txt(?:\?|$)/i.test(u) ||
        /\/(?:video|stream|play|media|cdn|hls)\//i.test(u) ||
        /(?:video|stream|play|cdn|hls)\./i.test(new URL(u).hostname) ||
        /\/(?:hls|hls2|hls3|hls4)\/(?:\d+\/)*(?:[^/]+\/)*[^/]+(?:master|index|playlist|media)\.(?:txt|m3u8)/i.test(u)
    } catch {
      return false
    }
  })
}

async function fetchPage(url: string, timeout = 10000): Promise<string | null> {
  const strategies = [
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://lk-21-apis.vercel.app/',
        'DNT': '1',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'iframe',
        'Sec-Fetch-Mode': 'navigate',
      },
    },
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.135 Mobile Safari/537.36',
        'Accept': '*/*',
        'Referer': 'https://google.com/',
      },
    },
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html',
      },
    },
  ]
  for (const s of strategies) {
    try {
      const res = await axios.get(url, { headers: s.headers, timeout, maxRedirects: 5, responseType: 'text', validateStatus: (st) => st < 400 })
      if (res.data && typeof res.data === 'string' && res.data.length > 50) return res.data
    } catch {}
  }
  return null
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const embedUrl = query.url as string

  if (!embedUrl) {
    throw createError({ statusCode: 400, message: 'URL embed diperlukan' })
  }

  let html = await fetchPage(embedUrl)
  if (!html || html.length < 50) {
    const parsed = new URL(embedUrl)
    const alt = `${parsed.protocol}//${parsed.host}${parsed.pathname}?${parsed.searchParams.toString()}`
    if (alt !== embedUrl) html = await fetchPage(alt)
  }

  if (!html || html.length < 50) {
    throw createError({ statusCode: 502, message: 'Gagal mengakses halaman embed' })
  }

  let videoUrl: string | null = null
  let videoType: 'hls' | 'mp4' = 'mp4'

  const pipelines: { name: string; fn: (html: string) => string | null }[] = [
    // Pipeline 0: Unpack JS packer and extract HLS URLs directly
    {
      name: 'unpack-hls',
      fn: (h) => {
        const scripts = h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || []
        for (const s of scripts) {
          const unpacked = unpackJsPacker(s)
          if (!unpacked) continue
          const m = unpacked.match(/https?:\/\/[^"'\s<>)]+\/(?:hls|hls2|hls3|hls4)\/[^"'\s<>)]+\.(?:m3u8|txt)[^"'\s<>)]*/)
          if (m) return m[0]
          // Prefer .m3u8 over master.txt (better CORS support)
          const m2 = unpacked.match(/https?:\/\/[^"'\s<>)]+\/[^"'\s<>]*\/master\.m3u8[^"'\s<>)]*/)
          if (m2) return m2[0]
          const m3 = unpacked.match(/https?:\/\/[^"'\s<>)]+\/[^"'\s<>]*\/master\.txt[^"'\s<>)]*/)
          if (m3) return m3[0]
          const allUrls = findAllUrls(unpacked)
          const vids = findVideoUrls(allUrls)
          if (vids.length) return vids[0]
        }
        return null
      },
    },

    // Pipeline 1: JWPlayer langsung
    {
      name: 'jw-sources',
      fn: (h) => {
        const m = h.match(/sources:\s*\[[\s\S]*?file:\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/)
        return m?.[1] || null
      },
    },
    {
      name: 'jw-file',
      fn: (h) => {
        const m = h.match(/file:\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/)
        return m?.[1] || null
      },
    },
    {
      name: 'jw-playlist',
      fn: (h) => {
        const m = h.match(/playlist:\s*\[[\s\S]*?sources:\s*\[[\s\S]*?file:\s*["']([^"']+)["']/)
        return m?.[1] || null
      },
    },

    // Pipeline 2: HTML tags
    {
      name: 'data-url',
      fn: (h) => {
        const m = h.match(/data-url\s*=\s*["']([^"']+)["']/)
        return m?.[1] || null
      },
    },
    {
      name: 'source-tag',
      fn: (h) => {
        const m = h.match(/<source[^>]+src\s*=\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/)
        return m?.[1] || null
      },
    },
    {
      name: 'video-tag',
      fn: (h) => {
        const m = h.match(/<video[^>]+src\s*=\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/)
        return m?.[1] || null
      },
    },

    // Pipeline 3: Raw URL extraction
    {
      name: 'm3u8-url',
      fn: (h) => {
        const m = h.match(/https?:\/\/[^"'\s<>]*\.m3u8[^"'\s<>]*/)
        return m?.[0] || null
      },
    },
    {
      name: 'mp4-url',
      fn: (h) => {
        const m = h.match(/https?:\/\/[^"'\s<>]*\.mp4[^"'\s<>]*/)
        return m?.[0] || null
      },
    },

    // Pipeline 4: JavaScript variable assignment
    {
      name: 'js-var-url',
      fn: (h) => {
        const m = h.match(/(?:var|let|const|,\s*)\s*(?:url|src|video|link|file|source|stream|play)\s*(?::|=)\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/i)
        return m?.[1] || null
      },
    },
    {
      name: 'js-var-any',
      fn: (h) => {
        const m = h.match(/(?:var|let|const)\s+\w+\s*=\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/i)
        return m?.[1] || null
      },
    },

    // Pipeline 5: Split/join obfuscation
    {
      name: 'split-join',
      fn: (h) => {
        const m = h.match(/["']([^"']+)["']\s*\.\s*split\s*\(\s*["'](["'])["']\s*\)\s*\.\s*join\s*\(\s*["'](["'])["']\s*\)/)
        // Can't easily resolve this without JS eval, skip
        return null
      },
    },

    // Pipeline 6: Script tags deep scan
    {
      name: 'script-scan',
      fn: (h) => {
        const scripts = h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || []
        for (const s of scripts) {
          const m = s.match(/["'](https?:\/\/[^"']+\.(?:m3u8|mp4)[^"']*)["']/)
          if (m) return m[1]
          const m2 = s.match(/["']https?:\/\/[^"']*(?:video|stream|play|media)[^"']*["']/)
          if (m2) {
            const url = m2[0].slice(1, -1)
            if (url.includes('.m3u8') || url.includes('.mp4')) return url
          }
        }
        return null
      },
    },

    // Pipeline 7: Base64 decode dari script
    {
      name: 'b64-decode',
      fn: (h) => {
        const b64Candidates = h.match(/["']([A-Za-z0-9+/=]{30,})["']/g) || []
        for (const c of b64Candidates) {
          const cleaned = c.replace(/["']/g, '')
          const decoded = decodeBase64(cleaned)
          if (decoded && decoded.includes('http')) {
            const urls = findAllUrls(decoded)
            const vids = findVideoUrls(urls)
            if (vids.length) return vids[0]
            if (urls.length) return urls[0]
          }
        }
        return null
      },
    },

    // Pipeline 8: atob() calls in JS
    {
      name: 'atob-calls',
      fn: (h) => {
        const atobs = h.match(/atob\s*\(\s*["']([^"']+)["']\s*\)/g) || []
        for (const a of atobs) {
          const m = a.match(/["']([^"']+)["']/)
          if (m) {
            const decoded = decodeBase64(m[1])
            if (decoded && decoded.includes('http')) {
              const urls = findAllUrls(decoded)
              const vids = findVideoUrls(urls)
              if (vids.length) return vids[0]
              if (urls.length) return urls[0]
            }
          }
        }
        return null
      },
    },

    // Pipeline 9: Base64-dari-ID (nekostream style)
    {
      name: 'b64-id',
      fn: (h) => {
        const m = h.match(/\?id=([A-Za-z0-9+/=]+)/) || h.match(/id=([A-Za-z0-9+/=]+)/)
        if (m) {
          const decoded = decodeBase64(m[1])
          if (decoded) {
            const urls = findAllUrls(decoded)
            const vids = findVideoUrls(urls)
            if (vids.length) return vids[0]
            if (urls.length) return urls[0]
          }
        }
        return null
      },
    },

    // Pipeline 10: Hex decode
    {
      name: 'hex-decode',
      fn: (h) => {
        const hexes = h.match(/["']([0-9a-fA-F]{50,})["']/g) || []
        for (const c of hexes) {
          const cleaned = c.replace(/["']/g, '')
          const decoded = decodeHex(cleaned)
          if (decoded && decoded.includes('http')) {
            const urls = findAllUrls(decoded)
            const vids = findVideoUrls(urls)
            if (vids.length) return vids[0]
            if (urls.length) return urls[0]
          }
        }
        return null
      },
    },

    // Pipeline 11: eval() content (base64 or direct URL)
    {
      name: 'eval-content',
      fn: (h) => {
        const evals = h.match(/eval\s*\(\s*["']([^"']+)["']\s*\)/g) || []
        for (const e of evals) {
          const m = e.match(/["']([^"']+)["']/)
          if (m) {
            const decoded = decodeBase64(m[1])
            if (decoded && decoded.includes('http')) {
              const urls = findAllUrls(decoded)
              const vids = findVideoUrls(urls)
              if (vids.length) return vids[0]
              if (urls.length) return urls[0]
            }
            // Try direct URL extraction from eval content
            const urls = findAllUrls(m[1])
            const vids = findVideoUrls(urls)
            if (vids.length) return vids[0]
          }
        }
        return null
      },
    },

    // Pipeline 12: JSON in script tags
    {
      name: 'json-config',
      fn: (h) => {
        const scripts = h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || []
        for (const s of scripts) {
          const jsonMatches = s.match(/\{[^{}]*"file"\s*:\s*"[^"]+"[^{}]*\}/g)
          if (jsonMatches) {
            for (const j of jsonMatches) {
              const fm = j.match(/"file"\s*:\s*"([^"]+)"/)
              if (fm) return fm[1]
            }
          }
        }
        return null
      },
    },

    // Pipeline 13: document.write(unescape(...)) + JS Packer
    {
      name: 'unescape-packer',
      fn: (h) => {
        const writes = h.match(/document\.write\s*\(\s*unescape\s*\(\s*["']([^"']+)["']\s*\)\s*\)/gi) || []
        for (const w of writes) {
          const mm = w.match(/["']([^"']+)["']/)
          if (!mm) continue
          const decoded = decodeUriComponent(mm[1])
          const unpacked = unpackJsPacker(decoded)
          if (unpacked) {
            const urlM = unpacked.match(/file\s*:\s*["']([^"']+)["']/)
            if (urlM) return urlM[1]
          }
        }
        return null
      },
    },

    // Pipeline 14: Direct JS Packer in any script
    {
      name: 'direct-packer',
      fn: (h) => {
        const scripts = h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || []
        for (const s of scripts) {
          const unpacked = unpackJsPacker(s)
          if (unpacked) {
            const urlM = unpacked.match(/file\s*:\s*["']([^"']+)["']/)
            if (urlM) return urlM[1]
            const allUrls = findAllUrls(unpacked)
            const vids = findVideoUrls(allUrls)
            if (vids.length) return vids[0]
            if (allUrls.length) return allUrls[0]
          }
        }
        return null
      },
    },

    // Pipeline 15: unescape only (no packer)
    {
      name: 'unescape-only',
      fn: (h) => {
        const mm = h.match(/unescape\s*\(\s*["']([^"']+)["']\s*\)/)
        if (mm) {
          const decoded = decodeUriComponent(mm[1])
          const all = findAllUrls(decoded)
          const vids = findVideoUrls(all)
          if (vids.length) return vids[0]
          if (all.length) return all[0]
        }
        return null
      },
    },

    // Pipeline 16: src-links or data-lazy-src attributes
    {
      name: 'data-lazy-src',
      fn: (h) => {
        const m = h.match(/data-(?:lazy-)?src\s*=\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/)
        return m?.[1] || null
      },
    },

    // Pipeline 17: iframe src with video-like URL
    {
      name: 'iframe-src',
      fn: (h) => {
        const iframes = h.match(/<iframe[^>]+src\s*=\s*["']([^"']+)["']/gi) || []
        for (const ifr of iframes) {
          const m = ifr.match(/src\s*=\s*["']([^"']+)["']/)
          if (m) {
            const url = m[1]
            if (/\.(?:m3u8|mp4)(?:\?|$)/i.test(url) || /player\.html/i.test(url)) return url
          }
        }
        return null
      },
    },

    // Pipeline 18: decodeURIComponent calls in JS
    {
      name: 'decode-uri',
      fn: (h) => {
        const calls = h.match(/decodeURIComponent\s*\(\s*["']([^"']+)["']\s*\)/g) || []
        for (const c of calls) {
          const m = c.match(/["']([^"']+)["']/)
          if (m) {
            const decoded = decodeUriComponent(m[1])
            const all = findAllUrls(decoded)
            const vids = findVideoUrls(all)
            if (vids.length) return vids[0]
            if (all.length) return all[0]
          }
        }
        return null
      },
    },

    // Pipeline 19: String.fromCharCode obfuscation
    {
      name: 'from-char-code',
      fn: (h) => {
        const codes = h.match(/String\.fromCharCode\s*\(([^)]+)\)/g) || []
        for (const c of codes) {
          const m = c.match(/\(([^)]+)\)/)
          if (m) {
            const nums = m[1].split(',').map((n: string) => parseInt(n.trim())).filter((n: number) => !isNaN(n))
            if (nums.length > 5) {
              const decoded = String.fromCharCode(...nums)
              if (decoded.includes('http')) {
                const all = findAllUrls(decoded)
                const vids = findVideoUrls(all)
                if (vids.length) return vids[0]
                if (all.length) return all[0]
              }
            }
          }
        }
        return null
      },
    },

    // Pipeline 20: regex exec in JS for URL building
    {
      name: 'regex-url',
      fn: (h) => {
        const m = h.match(/["']([^"']*\/\d+\/\d+\/[^"']*\.(?:m3u8|mp4)[^"']*)["']/)
        return m?.[1] || null
      },
    },

    // Pipeline 21: Voe.sx specific - fetch redirect or player URL
    {
      name: 'voe-specific',
      fn: (h) => {
        const m = h.match(/window\.location\s*=\s*["']([^"']+)["']/)
        return m?.[1] || null
      },
    },

    // Pipeline 22: HLS.js loadSource call
    {
      name: 'hls-load-source',
      fn: (h) => {
        const m = h.match(/(?:hls|player)\.loadSource\s*\(\s*["']([^"']+)["']/)
        return m?.[1] || null
      },
    },

    // Pipeline 23: config object with src/file key
    {
      name: 'config-object',
      fn: (h) => {
        const m = h.match(/"(?:src|file|url|video|source)"\s*:\s*"((?:[^"\\]|\\.)+\.(?:m3u8|mp4)[^"]*)/)
        return m?.[1] || null
      },
    },

    // Pipeline 24: document.write containing HTML with video source
    {
      name: 'docwrite-html',
      fn: (h) => {
        const writes = h.match(/document\.write\s*\(\s*(?:["']([^"']+)["']|`([^`]+)`)\s*\)/g) || []
        for (const w of writes) {
          const m = w.match(/["'`]([^"'`]+)["'`]/)
          if (m) {
            const decoded = decodeUriComponent(m[1])
            if (decoded.includes('.m3u8') || decoded.includes('.mp4')) {
              const all = findAllUrls(decoded)
              const vids = findVideoUrls(all)
              if (vids.length) return vids[0]
            }
          }
        }
        return null
      },
    },

    // Pipeline 25: script tag with inline JSON + video URL
    {
      name: 'inline-json-url',
      fn: (h) => {
        const scripts = h.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || []
        for (const s of scripts) {
          const urls = findAllUrls(s)
          for (const url of urls) {
            if (url.includes('.m3u8') || url.includes('.mp4')) return url
          }
        }
        return null
      },
    },
  ]

  for (const pipe of pipelines) {
    const result = pipe.fn(html)
    if (result) {
      videoUrl = result
        .replace(/\\\//g, '/')
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .trim()
        .split(/[\\"']/)[0]
        .trim()
      videoType = videoUrl.includes('.m3u8') || videoUrl.includes('/hls') || videoUrl.includes('.txt') ? 'hls' : 'mp4'
      break
    }
  }

  // External JS fetch: load all external scripts and scan for video URLs
  if (!videoUrl) {
    const scriptSrcs: string[] = []
    const scriptTags = html.match(/<script[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/gi) || []
    for (const tag of scriptTags) {
      const m = tag.match(/src\s*=\s*["']([^"']+)["']/)
      if (m) {
        let src = m[1]
        if (src.startsWith('//')) src = 'https:' + src
        else if (src.startsWith('/')) src = new URL(embedUrl).origin + src
        if (/\.(?:js|jsx|ts|mjs)\b/i.test(src) || src.includes('player')) {
          scriptSrcs.push(src)
        }
      }
    }
    for (const jsUrl of scriptSrcs.slice(0, 6)) {
      const jsContent = await fetchPage(jsUrl, 8000)
      if (jsContent) {
        for (const pipe of pipelines) {
          const result = pipe.fn(jsContent)
          if (result) {
            videoUrl = result
              .replace(/\\\//g, '/')
              .replace(/\\'/g, "'")
              .replace(/\\"/g, '"')
              .trim()
              .split(/[\\"']/)[0]
              .trim()
            videoType = videoUrl.includes('.m3u8') ? 'hls' : 'mp4'
            break
          }
        }
        if (videoUrl) break
      }
    }
  }

  // Try to find index.m3u8 patterns common in streaming
  if (!videoUrl) {
    const m = html.match(/['"](https?:\/\/[^"']*\/[^"']*index\.m3u8[^"']*)['"]/)
    if (m) {
      videoUrl = m[1]
      videoType = 'hls'
    }
  }

  // Try to find any URL with master/playlist/index/media manifest
  if (!videoUrl) {
    const m = html.match(/['"](https?:\/\/[^"']*\.(?:master|playlist|index|media)\.(?:m3u8|txt)[^"']*)['"]/)
    if (m) {
      videoUrl = m[1]
      videoType = 'hls'
    }
  }
  if (!videoUrl) {
    const m = html.match(/https?:\/\/[^"'\s<>)]*\/hls\d?\/\d+\/\d+\/[^"'\s<>)]+\/(?:master|index|playlist)\.(?:m3u8|txt)[^"'\s<>)]*/)
    if (m) {
      videoUrl = m[0]
      videoType = 'hls'
    }
  }

  // Two-stage: fetch secondary URLs from the page (candidate URLs + all found URLs)
  if (!videoUrl) {
    const allUrls = findAllUrls(html)
    const candidateUrls = allUrls.filter(u => {
      const lower = u.toLowerCase()
      return lower.includes('.php') || lower.includes('.json') || lower.includes('/api/') ||
        lower.includes('/v1/') || lower.includes('/v2/') || lower.includes('player') ||
        lower.includes('stream') || lower.includes('redirect') || lower.includes('get') ||
        lower.includes('fetch') || lower.includes('source') || lower.includes('token') ||
        lower.includes('key') || lower.includes('auth') || lower.includes('secret') ||
        lower.includes('hls') || lower.includes('video') || lower.includes('media')
    })
    const seen = new Set<string>()
    const toFetch = [...new Set([...allUrls, ...candidateUrls])].filter(u => {
      if (seen.has(u)) return false
      seen.add(u)
      const lower = u.toLowerCase()
      return !lower.includes('.css') && !lower.includes('.png') && !lower.includes('.jpg') &&
             !lower.includes('.svg') && !lower.includes('.ico') && !lower.includes('.woff')
    })
    for (const url of toFetch.slice(0, 10)) {
      const fetched = await fetchPage(url, 5000)
      if (fetched) {
        for (const pipe of pipelines) {
          const result = pipe.fn(fetched)
          if (result) {
            videoUrl = result
              .replace(/\\\//g, '/')
              .replace(/\\'/g, "'")
              .replace(/\\"/g, '"')
              .trim()
              .split(/[\\"']/)[0]
              .trim()
            videoType = videoUrl.includes('.m3u8') ? 'hls' : 'mp4'
            break
          }
        }
        if (videoUrl) break
      }
    }
  }

  // Fallback: try alternate URL patterns (player.html, /redirect, etc.)
  if (!videoUrl) {
    const parsed = new URL(embedUrl)
    const altPatterns = [
      `${parsed.protocol}//${parsed.host}/player.html`,
      `${parsed.protocol}//${parsed.host}/player`,
      `${parsed.protocol}//${parsed.host}/redirect?url=${encodeURIComponent(embedUrl)}`,
      `${parsed.protocol}//${parsed.host}/streaming`,
      `${parsed.protocol}//${parsed.host}/play`,
      embedUrl.replace('/e/', '/d/'),
      embedUrl.replace('/e/', '/f/'),
      embedUrl.replace('/embed/', '/'),
      embedUrl.replace('/embed/', '/player.html?'),
    ]
    for (const altUrl of altPatterns) {
      const altHtml = await fetchPage(altUrl, 5000)
      if (altHtml) {
        for (const pipe of pipelines) {
          const result = pipe.fn(altHtml)
          if (result) {
            videoUrl = result
              .replace(/\\\//g, '/')
              .replace(/\\'/g, "'")
              .replace(/\\"/g, '"')
              .trim()
              .split(/[\\"']/)[0]
              .trim()
            videoType = videoUrl.includes('.m3u8') ? 'hls' : 'mp4'
            break
          }
        }
        if (videoUrl) break
      }
    }
  }

  // Pipeline 14: Check if embedUrl is already a video URL
  if (!videoUrl) {
    const urlLower = embedUrl.toLowerCase()
    if (urlLower.includes('.m3u8') || urlLower.includes('.mp4')) {
      videoUrl = embedUrl
      videoType = urlLower.includes('.m3u8') || urlLower.includes('/hls') || urlLower.includes('/master.txt') ? 'hls' : 'mp4'
    }
  }

  if (!videoUrl) {
    return { success: false, url: embedUrl, type: 'embed' }
  }

  return { success: true, url: videoUrl, type: videoType }
})
