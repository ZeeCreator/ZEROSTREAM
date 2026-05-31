export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const perPage = Number(query.perPage) || 24

  try {
    const res: any = await $fetch(`${config.public.animeApiBase}/api/home/rilisan-terbaru`)
    const items = res?.results || []
    const allData: any[] = items.map((item: any) => ({
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
    }))
    const totalPages = Math.ceil(allData.length / perPage) || 1
    const start = (page - 1) * perPage
    const sliced = allData.slice(start, start + perPage)

    return {
      data: sliced,
      meta: {
        page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  } catch (err) {
    throw createError({ statusCode: 502, message: 'Gagal mengambil daftar anime' })
  }
})
