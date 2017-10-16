var express = require('express');
var webpack = require('webpack');
var opn = require('opn');
var webpackConfig = require('./webpack.config');

// Create our app
var app = express();
var PORT = 3001;
var compiler = webpack(webpackConfig);

app.use(require("webpack-dev-middleware")(compiler, {
  noInfo: false,
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(require("webpack-hot-middleware")(compiler, {
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}));

app.use(express.static('dist'));

app.listen(PORT, function () {
  console.log('Express server is up on port ' + PORT);
});

opn('http://localhost:' + PORT);
