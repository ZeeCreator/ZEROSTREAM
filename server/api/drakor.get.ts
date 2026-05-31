interface DrakorItemRaw {
  externalId: string
  title: string
  slug: string
  type: 'movie' | 'tv'
  posterUrl: string
  rating?: number
  quality?: string
  episodeCount?: string
}

interface DrakorResponse {
  success: boolean
  code: number
  message: string
  data: DrakorItemRaw[]
  meta: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = query.page || 1
  try {
    const res = await $fetch<DrakorResponse>(`https://lk-21-apis.vercel.app/api/v1/search/?q=korea&page=${page}`)
    return {
      items: (res.data || [])
        .filter((m: DrakorItemRaw) => {
          if (!m.posterUrl || m.posterUrl.startsWith('data:')) return false
          return true
        })
        .map((m: DrakorItemRaw) => ({
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
  } catch (err) {
    throw createError({ statusCode: 502, message: 'Gagal mengambil data drakor' })
  }
})
