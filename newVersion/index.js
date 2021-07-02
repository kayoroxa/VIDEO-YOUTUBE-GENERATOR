const ZeusInsta = require('./zeusInsta')

const instagramsIDs = [
  'memes24horasoficial',
  'videos_engracados2k',
  'videospradarrisada',
  'rindo.ate.2091',
]

async function main() {
  const zeus = await ZeusInsta({
    downloadFolder: 'videos_baixados',
    readyVideosFolder: 'videos_prontos',
    dataBaseFolder: './dataBaseFolder',
    maxPostGet: 10,
    instagramsIDs,
    headless: false,
    startBrowser: false,
  })

  // await zeus.getUrlDownload()
  // await zeus.extractDataFromVideos()
  // await zeus.downloadVideos()

  await zeus.formatDataBase()
  // await zeus.joinVideos()

  // await zeus.closeBrowser()
}

try {
  main()
} catch (error) {
  console.log(`error: ${error.message}`)
}
