import alt from '../alt'
import ProjectActions from '../actions/ProjectActions'

class ProjectStore {
  constructor() {
    this.projects = []
    this.loading = false

    if (!ProjectActions) {
      return
    }

    this.bindListeners({
      handleGetScoped: ProjectActions.GET_SCOPED,
      handleGetScopedCompleted: ProjectActions.GET_SCOPED_COMPLETED,
      handleGetScopedFailed: ProjectActions.GET_SCOPED_FAILED,
    })
  }

  handleGetScoped() {
    this.loading = true
  }

  handleGetScopedCompleted(projects) {
    this.projects = projects
    this.loading = false
  }

  handleGetScopedFailed() {
    this.loading = false
  }
}

export default alt.createStore(ProjectStore)
