const exec = require('child_process').exec
const fs = require('fs')
const glob = require('glob')

const fileNameOutput = 'output.mp4'

async function joinVideos({
  moveTodoToDone,
  getData,
  pathRoot,
  downloadFolder,
  readyVideosFolder,
}) {
  console.log('[BOT JOIN_VIDEOS] Joining videos...')
  const postsTodo = await getData('postsTodo')
  const filesList = await glob.sync(`${pathRoot}/${downloadFolder}/` + '*.mp4')

  const stringPraEscrever = filesList
    .map(filePath => {
      const fileName = filePath.replace(`${pathRoot}/${downloadFolder}/`, '')
      return `file '${downloadFolder}/${fileName}'`
    })
    .join('\n')

  console.log(`[BOT JOIN_VIDEOS] Joining ${JSON.stringify(filesList)}`)

  fs.writeFile(`${pathRoot}/mylist.txt`, stringPraEscrever, function (erro) {
    if (erro) {
      throw 'erro ao salvar'
    }
    console.log('[BOT JOIN_VIDEOS] Creating TEMP my list file to join...')
  })
  const fileNameOutputWithoutMp4 = fileNameOutput.replace('.mp4', '')
  const relativePathOutput = `${pathRoot}/${readyVideosFolder}/${fileNameOutputWithoutMp4}.mp4`
  await exec(
    `ffmpeg -y -f concat -safe 0 -i "${pathRoot}/mylist.txt" -c copy "${relativePathOutput}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error('[BOT JOIN_VIDEOS] Erro na compilação', stderr)
        throw 'erro na compilação'
      }
      console.log('[BOT JOIN_VIDEOS] Compilado', stdout)
      fs.unlink(`${pathRoot}/mylist.txt`, () => {
        console.log('[BOT JOIN_VIDEOS] TEMP mylist deleted')
        moveTodoToDone(postsTodo)
      })
    }
  )
}
module.exports = joinVideos
