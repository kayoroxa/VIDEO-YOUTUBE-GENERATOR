// const sleep = require('../../tools/sleep')
const { save } = require('../../tools/local-data-base.js')

function createApiUrl(postID) {
  const query = 'eaffee8f3c9c089c9904a5915a898814'

  const apiUrl = `https://www.instagram.com/graphql/query/?query_hash=${query}&variables=${encodeURIComponent(
    JSON.stringify({ shortcode: postID })
  )}`
  console.log(`[BOT EXTRACT_DATA] creating api url from: ${postID}...`)
  return { apiUrl, ID: postID }
}

async function getUrlDownload({ postsID, page, videosDbName }) {
  console.log(`[BOT GET_URL_DOWNLOAD] Receiving ${postsID.length} postsID`)
  const apiURLs = postsID.map(v => createApiUrl(v))

  // page.on('console', msg => console.log(msg.text()))
  const urlsAndIDs = await page.evaluate(
    async ({ apiURLs }) => {
      const postsUrlDownload = []
      for (let index in apiURLs) {
        // eslint-disable-next-line no-undef
        const response = await fetch(apiURLs[index].apiUrl)
        const data = await response.json()
        console.log({ data, api: apiURLs[index].apiUrl })
        const videoUrl = data.data['shortcode_media']['video_url']
        console.log(`[BOT GET_URL_DOWNLOAD] get url post ${index}`)
        await new Promise(r => setTimeout(r, 10000))
        postsUrlDownload.push({ url: videoUrl, ID: apiURLs[index].ID })
      }
      return postsUrlDownload
      // return [{ url: 'www.google.com', ID: 'CM5C1VqAlVS' }]
    },
    { apiURLs }
  )
  console.log(`[BOT GET_URL_DOWNLOAD] Saving data`)
  urlsAndIDs.forEach(urlAndID => {
    const { ID, url } = urlAndID
    save(videosDbName, db => db.map(v => (v.ID === ID ? { ...v, url } : v)))
  })
  // return videosUrl
}
module.exports = getUrlDownload

// console.log(createApiUrl('CMpXwgaAfOF'))
