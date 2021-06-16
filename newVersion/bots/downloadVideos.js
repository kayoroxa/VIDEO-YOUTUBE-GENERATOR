const fetch = require('node-fetch')
const fs = require('fs')

async function downloadVideos({ pathRoot, getData, downloadFolder }) {
  console.log('[BOT DOWNLOAD] starting...')
  const data = await getData('postsTodo')

  for (let index in data) {
    const videoUrl = data[index].videoUrl
    const postID = data[index].postID
    await downloadVideoToPath(
      `${pathRoot}/${downloadFolder}/${postID}.mp4`,
      videoUrl
    )
  }

  async function downloadVideoToPath(path, linkForDownload) {
    const response = await fetch(linkForDownload)
    const buffer = await response.buffer()

    fs.writeFile(path, buffer, () =>
      console.log(
        `[BOT DOWNLOAD] Downloaded video: ${linkForDownload} to ${downloadFolder}...`
      )
    )
  }
}
module.exports = downloadVideos
