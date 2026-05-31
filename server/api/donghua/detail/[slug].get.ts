export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const slug = getRouterParam(event, 'slug')
  try {
    const url = `${config.public.anichinApiBase}/api/anichin/series/${slug}`
    const res: any = await $fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    return res
  } catch (err) {
    throw createError({ statusCode: 502, message: 'Gagal mengambil detail donghua' })
  }
})
