const fetch = require('node-fetch')
const fs = require('fs')

async function downloadVideos({ pathRoot, getData, downloadFolder }) {
  console.log(`[BOT DOWNLOAD] starting... Download folder: ./${downloadFolder}`)
  const data = await getData('postsTodo')

  for (let index in data) {
    const postID = data[index].postID
    await downloadVideoToPath(
      data[index],
      `${pathRoot}/${downloadFolder}/${postID}.mp4`
    )
  }

  async function downloadVideoToPath({ videoUrl, postID, accountID }, path) {
    const response = await fetch(videoUrl)
    const buffer = await response.buffer()

    fs.writeFile(path, buffer, () =>
      console.log(
        `[BOT DOWNLOAD] Downloaded video: ${postID}, account: ${accountID}`
      )
    )
  }
}
module.exports = downloadVideos
