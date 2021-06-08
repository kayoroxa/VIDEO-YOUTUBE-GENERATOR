const botGetPostList = require('./botGetPostList')
const downloadInfiniteVideoInsta = require('./downloadInfiniteVideoInsta')
const joinVideos = require('./joinVideos')

const instagrams = [
  'https://www.instagram.com/videos_engracados2k/',
  'https://www.instagram.com/videospradarrisada/',
  'https://www.instagram.com/memes24horasoficial/',
  'https://www.instagram.com/rindo.ate.2091/',
]

async function main() {
  await botGetPostList(instagrams, { numberPost: 1 })
  await downloadInfiniteVideoInsta()
  await joinVideos('video_baixados', 'output.mp4')
}

main()
