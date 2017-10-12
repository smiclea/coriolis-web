import React from 'react'
import PropTypes from 'prop-types'
import styled, { injectGlobal } from 'styled-components'
import NotificationSystem from 'react-notification-system'

import NotificationsStyle from './NotificationsStyle.js'

import NotificationStore from '../../../stores/NotificationStore'

injectGlobal`
  ${NotificationsStyle}
`

const Wrapper = styled.div``

class Notifications extends React.Component {
  constructor() {
    super()

    this.state = NotificationStore.getState()
  }

  componentDidMount() {
    NotificationStore.listen((state) => { this.onStoreChange(state) })
  }

  componentWillUnmount() {
    NotificationStore.unlisten((state) => { this.onStoreChange(state) })
  }

  onStoreChange(state) {
    if (!state.notifications.length) {
      return
    }

    let lastNotification = state.notifications[state.notifications.length - 1]
    this.notificationSystem.addNotification({
      title: lastNotification.title || lastNotification.message,
      message: lastNotification.title ? lastNotification.message : null,
      level: lastNotification.level || 'info',
      position: 'br',
      autoDismiss: 10,
      action: lastNotification.action,
    })
  }

  render() {
    return (
      <Wrapper>
        <NotificationSystem ref={(n) => { this.notificationSystem = n }} />
      </Wrapper>
    )
  }
}

export default Notifications
