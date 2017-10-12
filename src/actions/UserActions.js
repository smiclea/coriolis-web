import alt from '../alt'

import UserSource from '../sources/UserSource'
import ProjectActions from './ProjectActions'
import ProjectStore from '../stores/ProjectStore'
import Wait from '../utils/Wait'
import NotificationActions from './NotificationActions'

class UserActions {
  login(data) {
    return (dispatch) => {
      dispatch()
      UserSource.login(data).then(this.loginSuccess, this.loginFailed)
    }
  }

  loginSuccess() {
    return (dispatch) => {
      dispatch()
      
      this.loginScoped()
    }
  }

  loginFailed() {
    return (dispatch) => {
      dispatch()
    }
  }

  loginScoped() {
    return (dispatch) => {
      dispatch()

      ProjectActions.getScoped()
      Wait.for(ProjectStore, state => state.projects.length, () => {
        UserSource.loginScoped(ProjectStore.getState().projects)
          .then(this.loginScopedSuccess, this.loginScopedFailed)
      })
    }
  }

  loginScopedSuccess(reponse) {
    return (dispatch) => {
      NotificationActions.notify('Signed in', 'success')
      dispatch(reponse)
    }
  }

  loginScopedFailed(response) {
    return (dispatch) => {
      dispatch(response)
    }
  }
}

export default alt.createActions(UserActions)
