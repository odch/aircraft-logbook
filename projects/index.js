const fs = require('fs')
const path = require('path')

function load(project) {
  const filePath = path.join(__dirname, project + '.json')
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function packinize(obj) {
  const newObj = {}

  Object.keys(obj).forEach(key => {
    const value = obj[key]

    let newValue
    if (typeof value === 'string') {
      newValue = JSON.stringify(value)
    } else if (typeof value === 'object') {
      newValue = packinize(value)
    } else {
      newValue = value
    }

    newObj[key] = newValue
  })

  return newObj
}

module.exports = {
  load,
  packinize
}
