import 'react-hot-loader/patch'
import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'

import { basename } from 'config'
import App from 'components/App.jsx'

const renderApp = () => (
  <HashRouter basename={basename}>
    <App />
  </HashRouter>
)

const root = document.getElementById('app')
render(renderApp(), root)

if (module.hot) {
  module.hot.accept('components/App.jsx', () => {
    require('components/App.jsx')
    render(renderApp(), root)
  })
}
