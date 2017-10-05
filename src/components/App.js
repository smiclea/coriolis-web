import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { injectGlobal, ThemeProvider } from 'styled-components'

// import LoginPage from './pages/LoginPage/LoginPage.js'
import { LoginPage } from 'components'

import theme from './themes/default'

injectGlobal`
  body {
    margin: 0;
  }
`

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route path="/" component={LoginPage} exact />
        {/* <Route path="/replicas" component={ReplicasPage} /> */}
        {/* <Route component={NotFoundPage} /> */}
      </Switch>
    </ThemeProvider>
  )
}

export default App
