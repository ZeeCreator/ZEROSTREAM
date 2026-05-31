export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const url = `${config.public.anichinApiBase}/api/anichin/home`
  const res: any = await $fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  }).catch(() => {
    throw createError({ statusCode: 502, message: 'Gagal mengambil data donghua' })
  })
  const d = res?.data || res
  const mapItem = (item: any) => ({
    title: item.title || '',
    slug: item.slug || '',
    poster: item.poster || '',
    type: item.type || null,
    episode: item.episode || null,
    status: item.status || null,
  })
  return {
    success: true,
    data: {
      slider: (d.slider || []).map(mapItem),
      popularToday: (d.popularToday || []).map(mapItem),
      latestRelease: (d.latestRelease || []).map(mapItem),
    }
  }
}, { maxAge: 600 })
