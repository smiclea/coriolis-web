import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { injectGlobal } from 'styled-components'

import { LoginPage, Fonts, StyleProps, Notifications, NotFoundPage, ReplicasPage } from 'components'

import UserActions from '../actions/UserActions'

injectGlobal`
  ${Fonts}
  body {
    margin: 0;
    font-family: Rubik;
    font-size: 9px;
    font-weight: ${StyleProps.fontWeights.regular}
  }
`
class App extends React.Component {
  componentWillMount() {
    UserActions.tokenLogin()
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path="/" component={LoginPage} exact />
          <Route path="/replicas" component={ReplicasPage} />
          <Route component={NotFoundPage} />
        </Switch>
        <Notifications />
      </div>
    )
  }
}

export default App
