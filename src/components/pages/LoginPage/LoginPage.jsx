import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import connectToStores from 'alt-utils/lib/connectToStores'

import { LoginTemplate, Logo, LoginForm } from 'components'
import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'
import UserActions from '../../../actions/UserActions'
import UserStore from '../../../stores/UserStore'

import backgroundImage from './images/star-bg.jpg'
import cloudbaseLogo from './images/cloudbase-logo.svg'

const Wrapper = styled.div`
  background-image: url('${backgroundImage}');
  background-color: transparent;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 142px;
  ${StyleProps.media.handheld`
    margin-top: 48px;
  `}
`

const StyledLoginForm = styled(LoginForm)`
  margin-top: 48px;
  ${StyleProps.media.handheld`
    margin-top: 32px;
  `}
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 48px;
`

const FooterText = styled.div`
  font-size: 10px;
  color: ${Palette.grayscale[4]};
  margin-bottom: 12px;
`

const FooterLogo = styled.div`
  background-image: url('${cloudbaseLogo}');
  width: 128px;
  height: 32px;
`

class LoginPage extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
  }

  static getStores() {
    return [UserStore]
  }

  static getPropsFromStores() {
    return UserStore.getState()
  }

  constructor() {
    super()

    this.state = {
      loading: false,
    }
  }

  componentDidMount() {
    document.title = 'Log In'
  }

  componentWillReceiveProps(props) {
    this.setState({ loading: props.loading })
  }

  handleFormSubmit(data) {
    this.setState({ loading: true })

    UserActions.login({
      name: data.username,
      password: data.password,
    })
  }

  render() {
    return (
      <LoginTemplate>
        <Wrapper>
          <Content>
            <Logo />
            <StyledLoginForm onFormSubmit={data => this.handleFormSubmit(data)} loading={this.state.loading} />
            <Footer>
              <FooterText>Coriolis® is a service offered by</FooterText>
              <FooterLogo />
            </Footer>
          </Content>
        </Wrapper>
      </LoginTemplate>
    )
  }
}

export default connectToStores(LoginPage)
