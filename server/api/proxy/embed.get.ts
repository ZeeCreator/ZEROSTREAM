import axios from 'axios'

function getOrigin(url: string): string {
  try {
    const u = new URL(url)
    return u.origin
  } catch {
    return url
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    throw createError({ statusCode: 400, message: 'URL diperlukan' })
  }

  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': url,
      },
      timeout: 15000,
      responseType: 'text',
      maxRedirects: 5,
    })

    let html = res.data as string
    const origin = getOrigin(url)

    // inject <base> tag so relative paths resolve against the original domain
    if (/<head/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, (match) => `${match}\n<base href="${origin}/">`)
    } else if (/<html/i.test(html)) {
      html = html.replace(/<html[^>]*>/i, (match) => `${match}\n<head><base href="${origin}/"></head>`)
    } else {
      html = `<head><base href="${origin}/"></head>\n` + html
    }

    // also rewrite any existing <base> tag
    html = html.replace(/<base[^>]*>/gi, `<base href="${origin}/">`)

    // rewrite absolute-path src/href/action to full URLs
    // (cover srcset, url() in inline styles, and dynamic JS as fallback)
    const attrPatterns = [
      { attr: 'src', isStyle: false },
      { attr: 'href', isStyle: false },
      { attr: 'action', isStyle: false },
      { attr: 'data-src', isStyle: false },
      { attr: 'data-lazy-src', isStyle: false },
    ]

    for (const { attr } of attrPatterns) {
      // only rewrite paths starting with / but not //
      html = html.replace(
        new RegExp(`(${attr}=")(/[^/"][^"]*)`, 'gi'),
        (match, prefix, path) => `${prefix}${origin}${path}`
      )
      html = html.replace(
        new RegExp(`(${attr}=')(/[^/'][^']*)`, 'gi'),
        (match, prefix, path) => `${prefix}${origin}${path}`
      )
    }

    // rewrite url() references in inline styles and link tags
    html = html.replace(
      /(url\(["']?)\/([^"')\s][^"')]*)["']?\)/gi,
      (match, prefix, path) => `${prefix}${origin}/${path}')`
    )

    setResponseHeaders(event, {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'X-Frame-Options': 'ALLOWALL',
      'Content-Security-Policy': "frame-ancestors *;",
      'Cache-Control': 'no-cache',
    })

    return html
  } catch (e: any) {
    throw createError({ statusCode: 502, message: `Gagal memuat embed: ${e.message}` })
  }
})
