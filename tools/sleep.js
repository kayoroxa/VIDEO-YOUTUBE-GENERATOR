const random = require('random-number')
function sleep(min, max) {
  const ms = random(min, max) * 1000
  return new Promise(resolve => setTimeout(resolve, ms))
}
module.exports = sleep
