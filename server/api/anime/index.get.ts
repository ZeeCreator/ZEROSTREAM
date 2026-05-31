export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  try {
    const res: any = await $fetch(`${config.public.animeApiBase}/api/search`, { params: query })
    const d = res?.results || res
    const items = d.results || d.data || d || []
    return Array.isArray(items) ? items.map((item: any) => ({
      title: item.title,
      slug: item.slug,
      poster: item.thumbnail,
      rating: null,
      quality: null,
      type: null,
      episode: item.episode || null,
      year: null,
      genre: null,
    })) : []
  } catch (err) {
    throw createError({ statusCode: 502, message: 'Gagal mengambil data anime' })
  }
})
