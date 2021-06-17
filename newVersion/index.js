const ZeusInsta = require('./zeusInsta')

const instagrams = [
  'https://www.instagram.com/videos_engracados2k/',
  'https://www.instagram.com/videospradarrisada/',
  'https://www.instagram.com/memes24horasoficial/',
  'https://www.instagram.com/rindo.ate.2091/',
]

async function main() {
  const zeus = await ZeusInsta({
    downloadFolder: 'videos_baixados',
    readyVideosFolder: 'videos_prontos',
    dataBaseFolder: './dataBaseFolder',
    maxPostGet: 1,
    instagrams,
    headless: true,
    // startBrowser: false,
  })

  await zeus.extractDataFromVideos()
  await zeus.downloadVideos()
  await zeus.joinVideos()

  await zeus.closeBrowser()
}

try {
  main()
} catch (error) {
  console.log(`error: ${error.message}`)
}
