import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import NotificationActions from '../../../actions/NotificationActions'
import { LoginFormField, Button } from 'components'

const Form = styled.form`
  background: rgba(221, 224, 229, 0.5);
  padding: 16px 32px 32px 32px;
  border-radius: 8px;
`

class LoginForm extends React.Component {
  static propTypes = {
    className: PropTypes.string,
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

    NotificationActions.notify('hellow')

    // if (this.state.username.length == 0 || this.state.password.length == 0) {
    //   NotificationActions.notify("Please fill in all fields")
    // } else {
    //   this.setState({ disableLogin: true })
    //   UserActions.login({
    //     name: this.state.username,
    //     password: this.state.password
    //   }, () => {
    //     this.setState({ disableLogin: false })
    //   })
    // }
  }

  render() {
    return (
      <Form className={this.props.className} onSubmit={this.handleFormSubmit}>
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
        <Button style={{ marginTop: '16px' }}>Login</Button>
      </Form>
    )
  }
}

export default LoginForm
