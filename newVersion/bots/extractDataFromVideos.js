const sleep = require('../../tools/sleep')

async function extractDataFromVideos({
  addData,
  page,
  maxPostGet,
  instaAccountUrl,
  instaAccountID,
}) {
  await sleep(3, 6)
  console.log(`[BOT EXTRACT_DATA] Received: ${instaAccountID}`)

  const dataFromVideos = await page.evaluate(
    async ({ maxPostGet, accountID, instaAccountUrl }) => {
      // eslint-disable-next-line no-undef
      const response = await fetch(`${instaAccountUrl}/?__a=1`)
      const data = await response.json()
      const nodePostList =
        data['graphql']['user']['edge_owner_to_timeline_media']['edges']
      const onlyVideosPost = nodePostList.filter(v => v.node.video_url)
      const videosDataFormatted = onlyVideosPost.map(v => ({
        postID: v.node.shortcode,
        videoUrl: v.node.video_url,
        accountID,
      }))
      return videosDataFormatted.slice(0, maxPostGet)
    },
    { maxPostGet, accountID: instaAccountID, instaAccountUrl }
  )
  console.log(
    `[BOT EXTRACT_DATA] Total posts Extract: ${dataFromVideos.length}, From: ${instaAccountID}`
  )
  const data = await dataFromVideos
  await addData('postsTodo', data)
}
module.exports = extractDataFromVideos
