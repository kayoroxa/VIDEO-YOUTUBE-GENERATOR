async function downloadVideos({ getData, downloadFolder }) {
  console.log('[BOT DOWNLOAD] starting...')
  const data = await getData('postsTodo')
  const videosUrl = data.map(post => post.videoUrl)
  console.log(`[BOT DOWNLOAD] VideosUrl: ${JSON.stringify(videosUrl)}`)

  for (let index in videosUrl) {
    const videoUrl = videosUrl[index]
    await downloadVideoToPath(downloadFolder, videoUrl)
  }

  async function downloadVideoToPath(downloadFolder, linkForDownload) {
    console.log(
      `[BOT DOWNLOAD] Downloading video: ${linkForDownload} to ${downloadFolder}...`
    )
  }
}
module.exports = downloadVideos
