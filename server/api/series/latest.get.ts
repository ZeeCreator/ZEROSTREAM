export default defineCachedEventHandler(async () => {
  return await $fetch('https://lk-21-apis.vercel.app/api/v1/streamtv/latest').catch(() => {
    throw createError({ statusCode: 502, message: 'Gagal mengambil series terbaru' })
  })
}, { maxAge: 600 })
