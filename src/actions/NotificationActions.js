import alt from '../alt'

class NotificationActions {
  notify(message, level, options) {
    return { message, level, ...options }
  }
}

export default alt.createActions(NotificationActions)
