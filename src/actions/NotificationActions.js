import alt from '../alt'

class NotificationActions {
  notify(message, level) {
    return { message, level }
  }
}

export default alt.createActions(NotificationActions)
