import React from 'react'
import { Switch, Route } from 'react-router-dom'
import styled, { injectGlobal } from 'styled-components'

import {
  LoginPage,
  Fonts,
  StyleProps,
  Notifications,
  NotFoundPage,
  ReplicasPage,
  ReplicaDetailsPage,
  MigrationsPage,
  MigrationDetailsPage,
  EndpointsPage,
  EndpointDetailsPage,
  WizardPage,
} from 'components'

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
          <Route path="/replica/:id" component={ReplicaDetailsPage} exact />
          <Route path="/replica/:page/:id" component={ReplicaDetailsPage} />
          <Route path="/migrations" component={MigrationsPage} />
          <Route path="/migration/:id" component={MigrationDetailsPage} exact />
          <Route path="/migration/:page/:id" component={MigrationDetailsPage} />
          <Route path="/endpoints" component={EndpointsPage} exact />
          <Route path="/endpoint/:id" component={EndpointDetailsPage} />
          <Route path="/wizard/:type" component={WizardPage} />
          <Route component={NotFoundPage} />
        </Switch>
        <Notifications />
      </Wrapper>
    )
  }
}

export default App
