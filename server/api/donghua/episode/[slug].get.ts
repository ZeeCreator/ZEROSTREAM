export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')
  const url = `${config.public.anichinApiBase}/api/anichin/episode/${slug}`
  const res: any = await $fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  }).catch(() => {
    throw createError({ statusCode: 502, message: 'Gagal mengambil data episode donghua' })
  })
  const data = res?.data
  if (data?.downloads) {
    data.downloads = data.downloads.map((group: any) => ({
      ...group,
      qualities: (group.qualities || []).map((q: any) => ({
        ...q,
        links: (q.links || []).slice(0, 3)
      }))
    }))
  }
  return res
}, { maxAge: 600 })
