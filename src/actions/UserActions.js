import alt from '../alt'

import UserSource from '../sources/UserSource'
import ProjectActions from './ProjectActions'
import ProjectStore from '../stores/ProjectStore'
import Wait from '../utils/Wait'
import NotificationActions from './NotificationActions'

class UserActions {
  login(data) {
    UserSource.login(data).then(this.loginSuccess, this.loginFailed)
    return data
  }

  loginSuccess() {
    this.loginScoped()
    return true
  }

  loginFailed() {
    return true
  }

  loginScoped() {
    ProjectActions.getScoped()
    Wait.for(() => ProjectStore.getState().projects.length, () => {
      UserSource.loginScoped(ProjectStore.getState().projects)
        .then(this.loginScopedSuccess, this.loginScopedFailed)
    })
    return true
  }

  loginScopedSuccess(response) {
    NotificationActions.notify('Signed', 'success')
    return response
  }

  loginScopedFailed(response) {
    return response || true
  }

  tokenLogin() {
    UserSource.tokenLogin().then(this.tokenLoginSuccess, this.tokenLoginFailed)
    return true
  }

  tokenLoginSuccess(response) {
    NotificationActions.notify('Signed in', 'success')
    return response || true
  }

  tokenLoginFailed(response) {
    return response || true
  }
}

export default alt.createActions(UserActions)
