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
      console.log(text)

      if (!isBrowserOpen && text.indexOf('webpack: Compiled successfully.')) {
        isBrowserOpen = true
        opn('http://localhost:' + PORT);
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
