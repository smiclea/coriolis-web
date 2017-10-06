import alt from '../alt/alt'
import NotificationActions from '../actions/NotificationActions'

class NotificationStore {
  constructor() {
    this.bindListeners({
      notify: NotificationActions.NOTIFY,
    })

    this.state = {
      notifications: [{ message: 'blabla' }],
    }
  }

  notify(message) {
    let newItem = {
      message,
    }

    this.setState({
      notifications: this.state.notifications.concat(newItem),
    })
  }
}

export default alt.createStore(NotificationStore)
