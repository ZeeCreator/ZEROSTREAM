export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const adultKeywords = ['hentai', 'ecchi', '18+', 'opantsu', 'barbaroi', 'yariman', 'fuck', 'sexy', 'dewasa', '18']

  try {
    const res: any = await $fetch(`${config.public.animeApiBase}/api/home/rilisan-terbaru`)
    const items = (res?.results || [])
      .filter((item: any) => {
        const lower = (item.title + ' ' + item.slug).toLowerCase()
        return adultKeywords.some(k => lower.includes(k))
      })
      .map((item: any) => ({
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
    return { success: true, data: items }
  } catch (err) {
    throw createError({ statusCode: 502, message: 'Gagal mengambil data hentai' })
  }
})
