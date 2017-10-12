import React from 'react'
import PropTypes from 'prop-types'
import connectToStores from 'alt-utils/lib/connectToStores'
import styled, { injectGlobal } from 'styled-components'
import NotificationSystem from 'react-notification-system'

import NotificationsStyle from './NotificationsStyle.js'

import NotificationStore from '../../../stores/NotificationStore'

injectGlobal`
  ${NotificationsStyle}
`

const Wrapper = styled.div``

class Notifications extends React.Component {
  static propTypes = {
    notifications: PropTypes.array,
  }

  static getStores() {
    return [NotificationStore]
  }

  static getPropsFromStores() {
    return NotificationStore.getState()
  }

  componentWillReceiveProps(props) {
    if (!props.notifications.length) {
      return
    }

    let lastNotification = props.notifications[props.notifications.length - 1]
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

export default connectToStores(Notifications)
