const puppeteer = require('puppeteer')
const { save, load } = require('../tools/local-data-base.js')

const botGetPostList = async (arrayInstagrans, options) => {
  console.log(options)
  const browser = await puppeteer.launch({
    userDataDir: './cache',
    // headless: false,
  })
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/4.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
  )

  const postList = []
  for (let index in arrayInstagrans) {
    const instagramUrl = arrayInstagrans[index]
    await page.goto(instagramUrl)

    const maxPostGet = options.numberPost
    const urlListSite = await page.evaluate(
      ({ maxPostGet }) => {
        const _urlListSite = []
        const elements = [...document.querySelectorAll('article a')]

        for (let index in elements.slice(0, maxPostGet || elements.length)) {
          const formatado = elements[index]
            .getAttribute('href')
            .replace('/p/', '')
            .replace('/', '')
          _urlListSite.push(formatado)
        }
        return _urlListSite
      },
      { maxPostGet }
    )

    postList.push(...urlListSite)
  }

  await browser.close()

  for (let index in postList) {
    const urlsTodo = load('urlsTodo')
    if (!urlsTodo.includes(postList[index])) {
      console.log(`${postList[index]} adicionado a lista`)
      save('urlsTodo', [...urlsTodo, postList[index]])
    } else {
      console.log(`${postList[index]} não colocado a lista pq já está`)
    }
  }
  // return postList
}
module.exports = botGetPostList
