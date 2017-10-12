import alt from '../alt'
import UserActions from '../actions/UserActions'

class UserStore {
  constructor() {
    this.user = null
    this.loading = false

    this.bindListeners({
      handleLogin: UserActions.LOGIN,
      handleLoginScopedSuccess: UserActions.LOGIN_SCOPED_SUCCESS,
      handleLoginScopedFailed: UserActions.LOGIN_SCOPED_FAILED,
      handleTokenLogin: UserActions.TOKEN_LOGIN,
      handleTokenLoginSuccess: UserActions.TOKEN_LOGIN_SUCCESS,
      handleTokenLoginFailed: UserActions.TOKEN_LOGIN_FAILED,
    })
  }

  handleLogin() {
    this.loading = true
    this.user = null
  }

  handleLoginScopedSuccess(data) {
    this.user = { ...data, scoped: true }
    this.loading = false
  }

  handleLoginScopedFailed() {
    this.user = null
    this.loading = false
  }

  handleTokenLogin() {
    this.user = null
    this.loading = true
  }

  handleTokenLoginSuccess(data) {
    this.user = { ...data, scoped: true }
    this.loading = false
  }

  handleTokenLoginFailed() {
    this.user = null
    this.loading = false
  }
}

export default alt.createStore(UserStore)
