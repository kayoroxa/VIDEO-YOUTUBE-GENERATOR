const ZeusInsta = require('./zeusInsta')

async function main() {
  const zeus = await ZeusInsta({
    downloadFolder: 'videos_baixados',
    readyVideosFolder: 'videos_prontos',
    dataBaseFolder: './dataBaseFolder',
  })
  // await zeus.startBrowser()

  await zeus.extractDataFromVideos()
  await zeus.downloadVideos()
  await zeus.joinVideos()

  await zeus.closeBrowser()
}
try {
  main()
} catch (error) {
  console.log(`error: ${error}`)
}
