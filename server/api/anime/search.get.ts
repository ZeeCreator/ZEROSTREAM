export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const q = query.q || ''
  if (!q) return { data: [], adult: [] }

  const adultKeywords = ['hentai', 'ecchi', '18+', 'opantsu', 'barbaroi', 'yariman', 'fuck', 'sexy', 'dewasa', '18']

  const res: any = await $fetch(`${config.public.animeApiBase}/api/search`, { params: { q } }).catch(() => {
    throw createError({ statusCode: 502, message: 'Gagal mencari anime' })
  })
  const list = (Array.isArray(res?.results?.results) ? res.results.results : []).map((item: any) => ({
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

  const normal: any[] = []
  const adult: any[] = []
  for (const item of list) {
    const lower = (item.title + ' ' + item.slug).toLowerCase()
    if (adultKeywords.some(k => lower.includes(k))) {
      adult.push(item)
    } else {
      normal.push(item)
    }
  }

  return { data: normal, adult }
})
