const { save, load } = require('../tools/local-data-base.js')
const puppeteer = require('puppeteer')

const bot = {
  downloadVideos: require('./bots/downloadVideos'),
  extractDataFromVideos: require('./bots/extractDataFromVideos'),
  joinVideos: require('./bots/joinVideos'),
  getUrlDownload: require('./bots/getUrlDownload'),
  formatDataBase: require('./bots/formatDataBase'),
}

async function ZeusInsta(options) {
  const parameters = {
    ...options,
    pageType: 'insta humor',
    pathRoot: 'newVersion',
    getData,
    addData,
    moveTodoToDone,
    videosDbName: 'videosDb',
    headless: options.headless === undefined ? true : options.headless,
  }

  async function startBrowser() {
    console.log('[BROWSER] Starting...')
    parameters.browser = await puppeteer.launch({
      userDataDir: './cache',
      headless: parameters.headless,
      ignoreDefaultArgs: ['--disable-extensions'],
      devtools: true,
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
      `[zeus addData] Adding data base ${postsData.length} post, from accountID: ${postsData[0].accountID}`
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
    for (let instaAccountID of parameters.instagramsIDs) {
      const instaAccountUrl = 'https://www.instagram.com/' + instaAccountID
      await parameters.page.goto(instaAccountUrl)
      console.log(`[ZEUS Loop] Atual insta Account ${instaAccountID}`)
      await callBack({
        ...parameters,
        instaAccountID,
        instaAccountUrl,
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
    formatDataBase: () => bot.formatDataBase(parameters),
    getUrlDownload: async () => {
      const postsID = await getData(parameters.videosDbName)
      await parameters.page.goto('https://www.instagram.com/')
      bot.getUrlDownload({
        ...parameters,
        postsID: postsID
          .filter(v => !v.url)
          .map(v => v.ID)
          .slice(0, 1),
      })
    },
    moveTodoToDone,
  }
}
module.exports = ZeusInsta
