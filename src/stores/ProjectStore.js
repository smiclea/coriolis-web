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
      handleGetProjects: ProjectActions.GET_PROJECTS,
      handleGetProjectsCompleted: ProjectActions.GET_PROJECTS_COMPLETED,
      handleGetProjectsFailed: ProjectActions.GET_PROJECTS_FAILED,
    })
  }

  handleGetProjects() {
    this.loading = true
  }

  handleGetProjectsCompleted(projects) {
    this.projects = projects
    this.loading = false
  }

  handleGetProjectsFailed() {
    this.loading = false
  }
}

export default alt.createStore(ProjectStore)
