const exec = require('child_process').exec
const fs = require('fs')
const glob = require('glob')
const pathRoot = 'instaBot'
const { save, load } = require('../tools/local-data-base.js')

async function moveTodoToDone(urls) {
  save('urlsDone', prev => [...prev, ...urls])
  save('urlsTodo', prev => prev.filter(valor => !urls.includes(valor)))
  console.log('moveu to other banco de dados')
}

const joinVideos = async (pathOutput, fileNameOutput) => {
  //ffmpeg -i "concat:input1|input2" -codec copy output.mp4
  //ffmpeg -f concat -i "1.mp4" -i "2.mp4" -c copy "output.mp4"
  const urlsTodo = load('urlsTodo')
  const filesList = await glob.sync(`${pathRoot}/video_baixados/` + '*.mp4')

  const stringPraEscrever = filesList
    .map(filePath => {
      const fileName = filePath.replace(`${pathRoot}/video_baixados/`, '')
      return `file 'video_baixados/${fileName}'`
    })
    .join('\n')

  console.log(stringPraEscrever)

  fs.writeFile(`${pathRoot}/mylist.txt`, stringPraEscrever, function (erro) {
    if (erro) {
      throw 'erro ao salvar'
    }
    console.log('TEMP mylist salvo')
  })
  const fileNameOutputWithoutMp4 = fileNameOutput.replace('.mp4', '')
  const relativePathOutput = `${pathRoot}/videos_prontos/${fileNameOutputWithoutMp4}.mp4`
  await exec(
    `ffmpeg -y -f concat -safe 0 -i "${pathRoot}/mylist.txt" -c copy "${relativePathOutput}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error('erro na compilação', stderr)
        throw 'erro na compilação'
      }
      console.log('compilado', stdout)
      fs.unlink(`${pathRoot}/mylist.txt`, () => {
        console.log('TEMP mylist APAGADO')
        moveTodoToDone(urlsTodo)
      })
    }
  )
}

module.exports = joinVideos
