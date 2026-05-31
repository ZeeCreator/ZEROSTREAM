export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const page = query.page || 1
  const res = await $fetch<{ success: boolean; data: { externalId: string; title: string; slug: string; posterUrl: string; rating?: number; quality: string }[]; meta: { page: number; totalPages: number; hasNext: boolean; hasPrev: boolean } }>(`https://lk-21-apis.vercel.app/api/v1/movies/rebahin?page=${page}`).catch(() => {
    throw createError({ statusCode: 502, message: 'Gagal mengambil data movie' })
  })
  return {
    items: (res.data || []).map(m => ({
      id: m.externalId,
      title: m.title,
      slug: m.slug,
      poster: m.posterUrl,
      rating: m.rating,
      quality: m.quality,
      type: 'movie' as const,
    })),
    meta: res.meta,
  }
}, { maxAge: 600 })
