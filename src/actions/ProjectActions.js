import alt from '../alt'

import PojectSource from '../sources/ProjectSource'

class ProjectActions {
  getProjects() {
    PojectSource.getProjects().then(
      this.getProjectsCompleted.bind(this),
      this.getProjectsFailed.bind(this)
    ).catch(this.getProjectsFailed.bind(this))

    return true
  }

  getProjectsCompleted(response) {
    return response || true
  }

  getProjectsFailed(response) {
    return response || true
  }
}

export default alt.createActions(ProjectActions)
