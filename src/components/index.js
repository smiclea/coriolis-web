const req = require.context('.', true)
const folders = ['/atoms/', '/molecules/', '/organisms/', '/templates/', '/pages/']

req.keys().forEach((key) => {
  if (folders.find(folder => key.indexOf(folder) > -1)) {
    const componentName = key.replace(/.*\/(.*?)\.jsx?$/, '$1')
    module.exports[componentName] = req(key).default
  }
})
