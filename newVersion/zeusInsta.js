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
    parameters.browser = await puppeteer.launch({
      userDataDir: './cache',
      headless: parameters.headless || true,
      ignoreDefaultArgs: ['--disable-extensions'],
    })
    parameters.page = await parameters.browser.newPage()
    await parameters.page.setUserAgent(
      'Mozilla/4.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    )
    // await parameters.page.goto('https://www.google.com.br/')
  }
  async function closeBrowser() {
    if (parameters.startBrowser !== false) {
      await parameters.browser.close()
      console.log('[BROWSER] Closed.')
    }
  }

  async function getData(path) {
    return load(path)
  }

  async function addData(path, postsData) {
    // {videoID, videoUrl}
    console.log(
      `[zeus addData] Adding data base post: ${postsData.postId}, videoUrl: ${postsData.accountID}`
    )

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
    console.log(`[MOVE TODO TO DONE] ${subject.map(v => v.postID).join(' & ')}`)
    save('postsDone', prev => [...prev, ...subject])
    save('postsTodo', prev => prev.filter(valor => !subject.includes(valor)))
  }
  async function loopForInstaAccounts(callBack) {
    for (let instaAccountUrl of parameters.instagrams) {
      await parameters.page.goto(instaAccountUrl)
      console.log(`[ZEUS Loop] Atual insta Account ${instaAccountUrl}`)
      await callBack({
        ...parameters,
        instaAccountUrl: instaAccountUrl,
      })
    }
  }

  if (parameters.startBrowser !== false) await startBrowser()
  return {
    startBrowser,
    closeBrowser,
    downloadVideos: async () => await bot.downloadVideos(parameters),
    extractDataFromVideos: async () => {
      await loopForInstaAccounts(bot.extractDataFromVideos)
    },
    joinVideos: () => bot.joinVideos(parameters),
    moveTodoToDone,
  }
}
module.exports = ZeusInsta
