import alt from '../alt'

import PojectSource from '../sources/ProjectSource'

class ProjectActions {
  getScoped() {
    return (dispatch) => {
      dispatch()
      PojectSource.getScoped().then(
        this.getScopedCompleted.bind(this),
        this.getScopedFailed.bind(this)
      ).catch(this.getScopedFailed.bind(this))
    }
  }

  getScopedCompleted(response) {
    return (dispatch) => {
      dispatch(response)
    }
  }

  getScopedFailed(response) {
    return (dispatch) => {
      dispatch(response)
    }
  }
}

export default alt.createActions(ProjectActions)
