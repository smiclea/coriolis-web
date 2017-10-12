import alt from '../alt'
import UserActions from '../actions/UserActions'

class UserStore {
  constructor() {
    this.user = {}
    this.loading = false

    this.bindListeners({
      handleLogin: UserActions.LOGIN,
      handleLoginScopedSuccess: UserActions.LOGIN_SCOPED_SUCCESS,
      handleLoginScopedFailed: UserActions.LOGIN_SCOPED_FAILED,
    })
  }

  handleLogin() {
    this.loading = true
    this.user = {}
  }

  handleLoginScopedSuccess(data) {
    this.user = { ...data, scoped: true }
    this.loading = false
  }

  handleLoginScopedFailed() {
    this.user = {}
    this.loading = false
  }
}

export default alt.createStore(UserStore)
