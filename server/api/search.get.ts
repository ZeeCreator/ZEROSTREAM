export interface SearchItemRaw {
  externalId: string
  title: string
  slug: string
  type: 'movie' | 'tv'
  posterUrl: string
  rating?: number
  quality?: string
  episodeCount?: string
}

export interface SearchResponse {
  success: boolean
  code: number
  message: string
  data: SearchItemRaw[]
  meta: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()
  const adult = query.adult === 'true'
  if (!q) {
    return { items: [], meta: { page: 1, totalPages: 0, hasNext: false, hasPrev: false } }
  }
  const adultKeywords = ['kamasutra', 'xx1', 'semi', '17+', 'hentai']
  const animeKeywords = ['subtitle indonesia', ' anime ', 'shippuden', ' shin ', 'sub indo', 'batch', ' episode ']
  try {
    const res = await $fetch<SearchResponse>(`https://lk-21-apis.vercel.app/api/v1/search/?q=${encodeURIComponent(q)}`)
    const isAdultItem = (m: SearchItemRaw) =>
      m.quality === '17+' || adultKeywords.some(k => m.title.toLowerCase().includes(k))
    const isAnimeItem = (m: SearchItemRaw) =>
      animeKeywords.some(k => (m.title + ' ' + m.slug).toLowerCase().includes(k))

    const items = (res.data || [])
      .filter((m: SearchItemRaw) => {
        if (!m.posterUrl || m.posterUrl.startsWith('data:')) return false
        if (isAnimeItem(m)) return false
        if (adult) return isAdultItem(m)
        return !isAdultItem(m)
      })
      .map((m: SearchItemRaw) => ({
        id: m.externalId,
        title: m.title,
        slug: m.slug,
        poster: m.posterUrl,
        rating: m.rating,
        quality: m.quality || undefined,
        type: m.type === 'tv' ? 'tv' as const : 'movie' as const,
        episodeCount: m.episodeCount || undefined,
      }))

    return { items, meta: res.meta }
  } catch (err) {
    throw createError({ statusCode: 502, message: 'Gagal mencari konten' })
  }
})
