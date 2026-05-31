export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const q = query.q || ''
  if (!q) return { success: true, data: { query: '', items: [] } }
  try {
    const url = `${config.public.anichinApiBase}/api/anichin/search?q=${encodeURIComponent(String(q))}`
    const res: any = await $fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    return res
  } catch (err) {
    throw createError({ statusCode: 502, message: 'Gagal mencari donghua' })
  }
})
