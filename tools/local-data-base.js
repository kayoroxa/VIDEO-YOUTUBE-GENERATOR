const fs = require('fs')

function save(key, contentOrFunc) {
  const contentFilePath = `newVersion/dataBase/${key}.json`
  let contentString
  if (typeof contentOrFunc === 'function') {
    contentString = JSON.stringify(contentOrFunc(load(key)))
  } else {
    contentString = JSON.stringify(contentOrFunc)
  }
  return fs.writeFileSync(contentFilePath, contentString)
}

function load(key) {
  const contentFilePath = `newVersion/dataBase/${key}.json`
  const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8')
  const contentJson = JSON.parse(fileBuffer)
  return contentJson || []
}

module.exports = {
  save,
  load,
}
