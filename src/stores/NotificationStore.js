import alt from '../alt'
import NotificationActions from '../actions/NotificationActions'

class NotificationStore {
  constructor() {
    this.bindListeners({
      notify: NotificationActions.NOTIFY,
    })

    this.notifications = []
  }

  notify(options) {
    let newItem = {
      ...options,
    }

    this.notifications = this.notifications.concat(newItem)
  }
}

export default alt.createStore(NotificationStore)
