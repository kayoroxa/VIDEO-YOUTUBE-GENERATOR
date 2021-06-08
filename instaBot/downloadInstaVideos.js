const save = require('instagram-save')
const { load } = require('../tools/local-data-base.js')
const glob = require('glob')

const pathRoot = 'instaBot'

const downloadInstaVideos = path => async pathVideos => {
  // const filesPathList = await glob.sync(`${pathRoot}/${pathVideos}` + '/*.mp4')
  // const idVideosDownloaded = filesPathList.map(filePath =>
  //   filePath.replace(`${pathRoot}/${pathVideos}/`, '')
  // )
  const videosId = load('urlsTodo')
  await save(videosId[0], path).then(res => {
    console.log(`baixou o video id: ${res.file}`)
  })

  // for (let index in videosId) {
  // console.log(videosId[index])
  // if (!idVideosDownloaded.includes(videosId[index])) {
  // await save(videosId[index], path).then(res => {
  // console.log(`baixou o video id: ${res.file}`)
  // })
  // } else console.log(`🤖 já foi baixado o video id: ${videosId[index]}`)
  // }
}

module.exports = downloadInstaVideos
