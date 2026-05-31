export default defineCachedEventHandler(async () => {
  return await $fetch('https://lk-21-apis.vercel.app/api/v1/genres/').catch(() => {
    throw createError({ statusCode: 502, message: 'Gagal mengambil daftar genre' })
  })
}, { maxAge: 600 })
