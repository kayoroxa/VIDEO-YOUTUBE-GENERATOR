const random = require('random-number')
async function sleep(min, max) {
  const secRandom = random({ min, max })
  const ms = secRandom * 1000
  console.log(`[SLEEP] ${Math.round(secRandom)} Secs`)
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = sleep
