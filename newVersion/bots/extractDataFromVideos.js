async function extractDataFromVideos({ addData, page }) {
  console.log(`[BOT EXTRACT_DATA] Opening instagram account in browser...`)
  console.log(`[BOT EXTRACT_DATA] Page: ${page}`)

  await page.exposeFunction('getPostsID', getPostsID)
  await page.exposeFunction('getLinkForDownload', getLinkForDownload)

  const dataFromVideos = await page.evaluate(async () => {
    const exports = []
    const postsID = await getPostsID()
    for (let index in postsID) {
      const postID = postsID[index]
      const videoUrl = await getLinkForDownload(postID)

      exports.push({ postID, videoUrl })
    }
    console.log(`[BOT EXTRACT_DATA] ${JSON.stringify(exports)}`)
    return exports
  })

  async function getPostsID() {
    console.log('ESTOU DENTRO DO GET_POST_ID')
    console.log(`[BOT EXTRACT_DATA] Getting videos IDs...`)
    return ['Jsd1i1243'] //, 'vfi84_f3', 'sdi12f43']
  }

  async function getLinkForDownload(postID) {
    const apiURL = await createApiUrl(postID)

    async function createApiUrl(postID) {
      console.log(`[BOT EXTRACT_DATA] creating api url from: ${postID}...`)
      return 'api_' + postID
    }

    console.log(
      `[BOT EXTRACT_DATA] getting VIDEO_URL from api url: ${apiURL}...`
    )
    return `www.${postID}.mp4`
  }

  const data = await dataFromVideos
  await addData('postsTodo', data)
}
module.exports = extractDataFromVideos
