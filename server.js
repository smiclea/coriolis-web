var express = require('express');

// Create our app
var app = express();
var PORT = 3001;

let isDev = process.argv.find(a => a === '--dev')
if (isDev) {
  let isBrowserOpen = false
  var webpack = require('webpack');
  var opn = require('opn');
  var webpackConfig = require('./webpack.config');
  var compiler = webpack(webpackConfig);

  app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: false,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true
    },
    log: function (text) {
      let statusIndex = text.indexOf('webpack: Compiled') > -1
        ? text.indexOf('webpack: Compiled') : text.indexOf('webpack: Failed')
      if (statusIndex > -1) {
        let left = text.substr(0, statusIndex)
        let isSuccesfull = text.indexOf('webpack: Compiled successfully.') > -1
        let color = text.indexOf('webpack: Compiled with warnings.') > -1 ? '\033[43m\033[30m' : ''
        color = isSuccesfull ? '\033[42m\033[30m' : color
        color = text.indexOf('webpack: Failed to compile.') > -1 ? '\033[41m' : color

        let end = color + text.substr(statusIndex) + '\033[0m'
        console.log(left + end)

        if (!isBrowserOpen && isSuccesfull) {
          isBrowserOpen = true
          opn('http://localhost:' + PORT);
        }
      } else {
        console.log(text)
      }
    } 
  }));

  app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
  }));
}

app.use(express.static('dist'));

app.listen(PORT, function () {
  console.log('Express server is up on port ' + PORT);
});
