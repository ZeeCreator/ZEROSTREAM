export interface TrendingItemRaw {
  externalId: string
  title: string
  slug: string
  type: 'movie' | 'tv'
  posterUrl: string
  rating?: number
  quality?: string
  episodeCount?: string
}

export interface TrendingResponse {
  success: boolean
  code: number
  message: string
  data: TrendingItemRaw[]
  meta: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean }
}

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const page = query.page || 1
  const res = await $fetch<TrendingResponse>(`https://lk-21-apis.vercel.app/api/v1/movies/trending?page=${page}`).catch(() => {
    throw createError({ statusCode: 502, message: 'Gagal mengambil trending' })
  })
  const adultKeywords = ['kamasutra', 'xx1', 'semi']
  return {
    items: (res.data || [])
      .filter(m => {
        if (m.quality === '17+') return false
        if (!m.posterUrl || m.posterUrl.startsWith('data:')) return false
        const lower = m.title.toLowerCase()
        if (adultKeywords.some(k => lower.includes(k))) return false
        return true
      })
      .map(m => ({
      id: m.externalId,
      title: m.title,
      slug: m.slug,
      poster: m.posterUrl,
      rating: m.rating,
      quality: m.quality || undefined,
      type: m.type === 'tv' ? 'tv' as const : 'movie' as const,
      episodeCount: m.episodeCount || undefined,
    })),
    meta: res.meta,
  }
}, { maxAge: 600 })
