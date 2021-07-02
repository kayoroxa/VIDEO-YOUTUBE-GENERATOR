const fetch = require('node-fetch')
const fs = require('fs')
const { save, load } = require('../../tools/local-data-base.js')
const _ = require('lodash')

async function downloadVideos({ pathRoot, downloadFolder, videosDbName }) {
  console.log(`[BOT DOWNLOAD] starting... Download folder: ./${downloadFolder}`)
  const db = await load(videosDbName)
  const data = db
    .filter(v => !v.down && v.url)
    .map(v => ({ videoUrl: v.url, postID: v.ID, accountID: '' }))

  for (let index in data) {
    const postID = data[index].postID
    await downloadVideoToPath(
      data[index],
      `${pathRoot}/${downloadFolder}/${postID}.mp4`
    )
    const changedDb = db
    _(changedDb).find({ ID: postID }).down = true
    await save(videosDbName, () => db)
  }

  async function downloadVideoToPath({ videoUrl, postID, accountID }, path) {
    const response = await fetch(videoUrl)
    const buffer = await response.buffer()

    await fs.writeFileSync(path, buffer)
    console.log(
      `[BOT DOWNLOAD] Downloaded video: ${postID}, account: ${accountID}`
    )
  }
}
module.exports = downloadVideos
