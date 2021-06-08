const axios = require('axios')
const fetch = require('node-fetch')
const fs = require('fs')
const { load } = require('../tools/local-data-base.js')
const glob = require('glob')
const pathRoot = 'instaBot'

async function pegaOLinkEBaixa(linkForDownload, pathOutput, shortVideoCode) {
  const response = await fetch(linkForDownload)
  const buffer = await response.buffer()

  fs.writeFile(pathOutput, buffer, () =>
    console.log(`${shortVideoCode} finished downloading video!`)
  )
}

async function geraOLink(shortVideoCode) {
  const query = 'eaffee8f3c9c089c9904a5915a898814'

  const urlResult = `https://www.instagram.com/graphql/query/?query_hash=${query}&variables=${encodeURIComponent(
    JSON.stringify({ shortcode: shortVideoCode })
  )}`

  const res = await axios.get(urlResult)
  const linkForDownload = res.data.data['shortcode_media']['video_url']
  return linkForDownload
}

async function downloadInfiniteVideoInsta() {
  const linksNoTodoUrls = load('urlsTodo')
  const linksJaBaixados = await glob.sync('*.mp4', {
    cwd: `${pathRoot}/video_baixados/`,
  })

  for (let index in linksNoTodoUrls) {
    const link = linksNoTodoUrls[index]
    if (!linksJaBaixados.includes(link + '.mp4')) {
      const urlBig = await geraOLink(link)
      pegaOLinkEBaixa(urlBig, `./${pathRoot}/video_baixados/${link}.mp4`, link) // tirar essa dependência do link
    } else {
      console.log(`Não fez download do ${link} pq já foi baixado`)
    }
  }
}

module.exports = downloadInfiniteVideoInsta
