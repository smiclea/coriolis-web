import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { LoginFormField, Button, LoginOptions, Spinner } from 'components'

import StyleProps from '../../styleUtils/StyleProps'

import errorIcon from './images/error.svg'

import { loginButtons } from '../../../config'
import NotificationActions from '../../../actions/NotificationActions'

const Form = styled.form`
  background: rgba(221, 224, 229, 0.5);
  padding: 16px 32px 32px 32px;
  border-radius: 8px;
`

const FormFields = styled.div`
  display: flex;
  margin-left: -16px;
  ${loginButtons.length < 3 ? css`flex-direction: column;` : ''}
`

const LoginSeparator = styled.div`
  margin: 8px 0 24px;
  opacity: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SeparatorLine = styled.div`
  width: 19px;
  border-top: 1px solid white;
`

const SeparatorText = styled.div`
  font-size: 12px;
  color: white;
  flex-grow: 1;
  text-align: center;
`

const SpinnerLayout = styled(Spinner)`
  position: absolute;
  top: 8px;
  right: 8px;
`
const LoginError = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 16px;
`

const LoginErrorIcon = styled.div`
  width: 26px;
  height: 26px;
  background-image: url('${errorIcon}');
`

const LoginErrorText = styled.div`
  color: white;
  font-size: 12px;
  margin-top: 4px;
  width: ${StyleProps.inputSize.width}px;
  text-align: center;
`

class LoginForm extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    loading: PropTypes.bool,
    loginFailed: PropTypes.bool,
    onFormSubmit: PropTypes.func,
  }

  static defaultProps = {
    className: '',
  }

  constructor() {
    super()

    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)

    this.state = {
      username: '',
      password: '',
    }
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value })
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  handleFormSubmit(e) {
    e.preventDefault()

    if (this.state.username.length === 0 || this.state.password.length === 0) {
      NotificationActions.notify('Please fill in all fields')
    } else {
      this.props.onFormSubmit({ username: this.state.username, password: this.state.password })
    }
  }

  render() {
    let loginSeparator = loginButtons.length ? (
      <LoginSeparator>
        <SeparatorLine />
        <SeparatorText>or sign in with username</SeparatorText>
        <SeparatorLine />
      </LoginSeparator>
    ) : null

    let buttonContent = this.props.loading ?
      <span>Please wait ... <SpinnerLayout /></span> : 'Login'

    let loginError = this.props.loginFailed ? (
      <LoginError>
        <LoginErrorIcon />
        <LoginErrorText>
          The username or password did not match. Please try again.
        </LoginErrorText>
      </LoginError>
    ) : null

    return (
      <Form className={this.props.className} onSubmit={this.handleFormSubmit}>
        {loginError}  
        <LoginOptions />
        {loginSeparator}
        <FormFields>
          <LoginFormField
            label="Username"
            value={this.state.username}
            name="password"
            onChange={this.handleUsernameChange}
          />
          <LoginFormField
            label="Password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            name="password"
            type="password"
          />
        </FormFields>
        <Button style={{ position: 'relative', width: '100%', marginTop: '16px' }} disabled={this.props.loading}>
          {buttonContent}
        </Button>
      </Form>
    )
  }
}

export default LoginForm