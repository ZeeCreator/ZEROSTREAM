export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const res: any = await $fetch(`${config.public.animeApiBase}/api/home`, { params: { page } }).catch(() => {
    throw createError({ statusCode: 502, message: 'Gagal mengambil data anime v2' })
  })
  const d = res?.results || res
  const mapItem = (item: any) => ({
    title: item.title,
    slug: item.slug,
    poster: item.thumbnail,
    rating: null,
    quality: null,
    type: null,
    episode: item.episode || null,
    year: null,
    genre: null,
    link: item.link || null,
  })
  return {
    popularToday: (d.populer_hari_ini || []).map(mapItem),
    latest: (d.rilisan_terbaru || []).map(mapItem),
    popularWeekly: (d.recommendation || []).map(mapItem),
  }
}, { maxAge: 600 })
