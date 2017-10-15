import alt from '../alt'

import PojectSource from '../sources/ProjectSource'

class ProjectActions {
  getScoped() {
    PojectSource.getScoped().then(
      this.getScopedCompleted.bind(this),
      this.getScopedFailed.bind(this)
    ).catch(this.getScopedFailed.bind(this))

    return true
  }

  getScopedCompleted(response) {
    return response
  }

  getScopedFailed(response) {
    return response
  }
}

export default alt.createActions(ProjectActions)
