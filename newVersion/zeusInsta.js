const { save, load } = require('../tools/local-data-base.js')
const puppeteer = require('puppeteer')

const bot = {
  downloadVideos: require('./bots/downloadVideos'),
  extractDataFromVideos: require('./bots/extractDataFromVideos'),
  joinVideos: require('./bots/joinVideos'),
}

async function ZeusInsta(options) {
  const parameters = {
    ...options,
    pageType: 'insta humor',
    pathRoot: 'newVersion',
    getData,
    addData,
    moveTodoToDone,
  }

  async function startBrowser() {
    console.log('[BROWSER] Starting...')
    const browser = await puppeteer.launch({
      userDataDir: './cache',
      headless: false,
    })
    parameters.page = await browser.newPage()
    await parameters.page.setUserAgent(
      'Mozilla/4.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    )
    await parameters.page.goto('https://www.google.com.br/')
  }
  async function closeBrowser() {
    console.log('[BROWSER] Closing...')
  }

  async function getData(path) {
    return load(path)
  }

  async function addData(path, postsData) {
    // {videoID, videoUrl}
    console.log(`[zeus addData] Adding content: ${JSON.stringify(postsData)}`)

    return save(path, prev => {
      const prevPostID = prev.map(data => data.postID)
      const newPrev = [...prev]
      for (let postData of postsData) {
        if (!prevPostID.includes(postData.postID)) {
          newPrev.push(postData)
        }
      }
      return newPrev
    })
  }

  async function moveTodoToDone(subject) {
    console.log(`[MOVE TODO TO DONE] ${JSON.stringify(subject)}`)
    save('postsDone', prev => [...prev, ...subject])
    save('postsTodo', prev => prev.filter(valor => !subject.includes(valor)))
    console.log('moveu to other banco de dados')
  }

  await startBrowser()
  return {
    startBrowser,
    closeBrowser,
    downloadVideos: () => bot.downloadVideos(parameters),
    extractDataFromVideos: () => bot.extractDataFromVideos(parameters),
    joinVideos: () => bot.joinVideos(parameters),
    moveTodoToDone,
  }
}
module.exports = ZeusInsta
