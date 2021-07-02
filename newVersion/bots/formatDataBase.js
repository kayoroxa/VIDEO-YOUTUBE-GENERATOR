const glob = require('glob')
const _ = require('lodash')
const { save } = require('../../tools/local-data-base')

async function formatDataBase({ getData, pathRoot, videosDbName }) {
  const idFolderDownloaded = await glob
    .sync('*', {
      cwd: `${pathRoot}/videos_baixados`,
    })
    .map(v => v.replace('.mp4', ''))

  const db = await getData(videosDbName)

  // idFolderDownloaded.forEach(idDownloaded => {
  for (let index in db) {
    const id = db[index].ID
    if (idFolderDownloaded.includes(id)) db[index].down = true
    else db.push({ ID: id, down: true })
  }
  console.log(db.filter(v => v.down))
  // })

  // console.log(db)

  // const db = await getData()

  // const changedDb = db

  // _(changedDb).find({ ID: postID }).down = true

  // await save(videosDbName, () => db)
}

module.exports = formatDataBase
