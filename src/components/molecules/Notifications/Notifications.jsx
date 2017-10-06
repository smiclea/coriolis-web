import React from 'react'
import connectToStores from 'alt-utils/lib/connectToStores'
import styled, { injectGlobal } from 'styled-components'
import NotificationSystem from 'react-notification-system'

import NotificationsStyle from './NotificationsStyle.js'

import NotificationStore from '../../../stores/NotificationStore'

injectGlobal`
  ${NotificationsStyle}
`

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
`

class Notifications extends React.Component {
  static getStores() {
    return [NotificationStore]
  }

  static getPropsFromStores() {
    return NotificationStore.getState()
  }

  componentDidMount() {
    this._notificationSystem = this.notificationSystem
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.notifications.length) {
      return
    }

    let lastNotification = newProps.notifications[newProps.notifications.length - 1]
    this._notificationSystem.addNotification({
      title: lastNotification.title || lastNotification.message,
      message: lastNotification.title ? lastNotification.message : null,
      level: lastNotification.level || 'info',
      position: 'br',
      autoDismiss: 10,
      action: lastNotification.action,
    })
  }

  _notificationSystem = null

  _addNotification(event) {
    event.preventDefault()
    this._notificationSystem.addNotification({
      message: 'Notification message',
      level: 'success',
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
