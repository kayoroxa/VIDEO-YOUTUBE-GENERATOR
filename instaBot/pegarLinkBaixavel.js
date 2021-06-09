const puppeteer = require('puppeteer')

async function pegarLinkBaixavel(linkFeioso) {
  const browser = await puppeteer.launch({
    userDataDir: './cache',
    headless: false,
  })
  const page = await browser.newPage()
  await page.goto('https://www.instagram.com/')
  await page.setUserAgent(
    'Mozilla/4.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
  )
  const VIDEO_URL = await page.evaluate(
    async ({ linkFeioso }) => {
      const response = await fetch(linkFeioso)
      const data = await response.json()
      const videoUrl = data.data['shortcode_media']['video_url']
      return videoUrl
    },
    { linkFeioso }
  )
  await browser.close()
  return VIDEO_URL
}

module.exports = pegarLinkBaixavel
