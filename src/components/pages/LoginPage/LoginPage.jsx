import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import connectToStores from 'alt-utils/lib/connectToStores'

import { EmptyTemplate, Logo, LoginForm } from 'components'
import StyleProps from '../../styleUtils/StyleProps'
import UserActions from '../../../actions/UserActions'
import UserStore from '../../../stores/UserStore'

import backgroundImage from './images/star-bg.jpg'
import footerImage from './images/footer.svg'

const Wrapper = styled.div`
  background-image: url('${backgroundImage}');
  background-color: transparent;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  position: absolute;
  overflow: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 77px;
  ${StyleProps.media.handheld`
    margin-top: 96px;
  `}
`

const StyledLoginForm = styled(LoginForm)`
  margin-top: 32px;
  ${StyleProps.media.handheld`
    margin-top: 32px;
  `}
`

const Footer = styled.div`
  position: absolute;
  bottom: 48px;
  width: 176px;
  height: 62px;
  background: url('${footerImage}') center no-repeat;
`

class LoginPage extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    loginFailed: PropTypes.bool,
    user: PropTypes.object,
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
    if (props.user) {
      window.location.href = '/#/replicas'
    }
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
      <EmptyTemplate>
        <Wrapper>
          <Content>
            <Logo />
            <StyledLoginForm
              onFormSubmit={data => this.handleFormSubmit(data)}
              loading={this.props.loading}
              loginFailed={this.props.loginFailed}
            />
            <Footer />
          </Content>
        </Wrapper>
      </EmptyTemplate>
    )
  }
}

export default connectToStores(LoginPage)
