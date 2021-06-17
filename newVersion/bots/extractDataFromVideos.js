async function extractDataFromVideos({
  addData,
  page,
  maxPostGet,
  instaAccountUrl,
}) {
  const accountID = instaAccountUrl
    .replace('https://www.instagram.com/', '')
    .replace('/', '')

  console.log(`[BOT EXTRACT_DATA] Received: ${accountID}`)
  try {
    await page.exposeFunction('getPostsID', getPostsID)
    await page.exposeFunction('getLinkForDownload', getLinkForDownload)
  } catch (error) {
    console.log(
      `[BOT EXTRACT_DATA] Don't add exposeFunctions, cause ${error.message}`
    )
  }

  async function getPostsID(maxPostGet, elements) {
    console.log(`[BOT EXTRACT_DATA] Getting videos IDs...`)
    const _postsID = []

    for (let index in elements.slice(0, maxPostGet || elements.length)) {
      const formatado = elements[index]
        .getAttribute('href')
        .replace('/p/', '')
        .replace('/', '')
      _postsID.push(formatado)
    }
    return _postsID // ['vfi84_f3', 'sdi12f43']
  }

  async function getLinkForDownload(postID) {
    const apiURL = await createApiUrl(postID)

    async function createApiUrl(postID) {
      const query = 'eaffee8f3c9c089c9904a5915a898814'

      const urlResult = `https://www.instagram.com/graphql/query/?query_hash=${query}&variables=${encodeURIComponent(
        JSON.stringify({ shortcode: postID })
      )}`

      console.log(`[BOT EXTRACT_DATA] creating api url from: ${postID}...`)
      return urlResult
    }

    const videoUrl = await page.evaluate(
      async ({ apiURL }) => {
        // eslint-disable-next-line no-undef
        const response = await fetch(apiURL)
        const data = await response.json()
        const videoUrl = data.data['shortcode_media']['video_url']
        console.log(`[BOT EXTRACT_DATA] ${videoUrl}`)
        return videoUrl
      },
      { apiURL }
    )

    return videoUrl
  }

  const dataFromVideos = await page.evaluate(
    async ({ maxPostGet, accountID }) => {
      const exports = []
      // eslint-disable-next-line no-undef
      const elements = [...document.querySelectorAll('article a')]
      const postsID = []

      for (let index in elements.slice(0, maxPostGet || elements.length)) {
        const formatado = elements[index]
          .getAttribute('href')
          .replace('/p/', '')
          .replace('/', '')
        postsID.push(formatado)
      }

      console.log({ postsID })
      for (let index in postsID) {
        const postID = postsID[index]
        const videoUrl = await getLinkForDownload(postID)

        if (videoUrl) exports.push({ postID, videoUrl, accountID })
      }
      return exports
    },
    { maxPostGet, accountID }
  )
  console.log(`[BOT EXTRACT_DATA] ${JSON.stringify(dataFromVideos)}`)
  const data = await dataFromVideos
  await addData('postsTodo', data)
}
module.exports = extractDataFromVideos
