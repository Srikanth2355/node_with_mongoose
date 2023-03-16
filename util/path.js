const path = require('path')
// path.dirname(process.mainmodule.filename)
module.exports = path.dirname(require.main.filename)