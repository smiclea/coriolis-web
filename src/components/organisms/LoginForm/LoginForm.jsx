import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { LoginFormField, Button, LoginOptions, Spinner } from 'components'

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

class LoginForm extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    loading: PropTypes.bool,
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
      loading: false,
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      loading: props.loading,
    })
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

    let buttonContent = this.state.loading ?
      <span>Please wait ... <SpinnerLayout /></span> : 'Login'

    return (
      <Form className={this.props.className} onSubmit={this.handleFormSubmit}>
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
        <Button style={{ position: 'relative', width: '100%', marginTop: '16px' }} disabled={this.state.loading}>
          {buttonContent}
        </Button>
      </Form>
    )
  }
}

export default LoginForm
