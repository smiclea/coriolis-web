import React from 'react'
import { Switch, Route } from 'react-router-dom'
import styled, { injectGlobal } from 'styled-components'

import { LoginPage, Fonts, StyleProps, Notifications, NotFoundPage, ReplicasPage } from 'components'

import Palette from './styleUtils/Palette'
import UserActions from '../actions/UserActions'

injectGlobal`
  ${Fonts}
  body {
    margin: 0;
    color: ${Palette.black};
    font-family: Rubik;
    font-size: 14px;
    font-weight: ${StyleProps.fontWeights.regular}
  }
`
const Wrapper = styled.div``

class App extends React.Component {
  componentWillMount() {
    UserActions.tokenLogin()
  }

  render() {
    return (
      <Wrapper>
        <Switch>
          <Route path="/" component={LoginPage} exact />
          <Route path="/replicas" component={ReplicasPage} />
          <Route component={NotFoundPage} />
        </Switch>
        <Notifications />
      </Wrapper>
    )
  }
}

export default App
