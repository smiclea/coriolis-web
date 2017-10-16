import Api from '../utils/ApiCaller'

import { servicesUrl } from '../config'

class ProjectsSource {
  static getProjects() {
    return new Promise((resolve, reject) => {
      Api.sendAjaxRequest({
        url: servicesUrl.projects,
        method: 'GET',
      }).then((response) => {
        if (response.data.projects) {
          resolve(response.data.projects)
        }
      }, reject).catch(reject)
    })
  }
}

export default ProjectsSource
