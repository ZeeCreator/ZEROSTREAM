export default defineEventHandler(async () => {
  try {
    return await $fetch('https://lk-21-apis.vercel.app/api/v1/streamtv/latest')
  } catch (err) {
    throw createError({ statusCode: 502, message: 'Gagal mengambil series terbaru' })
  }
})
