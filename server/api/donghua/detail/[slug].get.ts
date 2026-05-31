export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')
  const url = `${config.public.anichinApiBase}/api/anichin/series/${slug}`
  const res: any = await $fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  }).catch(() => {
    throw createError({ statusCode: 502, message: 'Gagal mengambil detail donghua' })
  })
  const d = res?.data
  if (d?.episodes) {
    d.episodes = d.episodes.map((ep: any) => ({
      number: ep.number || '',
      title: ep.title || '',
      slug: ep.slug || '',
      date: ep.date || ''
    }))
  }
  return res
}, { maxAge: 600 })
