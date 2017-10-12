import cookie from 'js-cookie'

import Api from '../utils/ApiCaller'

import { servicesUrl } from '../config'

class UserSource {
  static login(userData) {
    let auth = {
      auth: {
        identity: {
          methods: ['password'],
          password: {
            user: {
              name: userData.name,
              domain: { name: 'default' },
              password: userData.password,
            },
          },
        },
        scope: 'unscoped',
      },
    }

    Api.setDefaultHeader('X-Auth-Token', null)

    return new Promise((resolve, reject) => {
      Api.sendAjaxRequest({
        url: servicesUrl.identity,
        method: 'POST',
        data: auth,
      }).then((response) => {
        let token = response.headers['X-Subject-Token'] || response.headers['x-subject-token']
        Api.setDefaultHeader('X-Auth-Token', token)
        cookie.set('unscopedToken', token, { expires: 1 / 24 })
        resolve(response)
      }, reject).catch(reject)
    })
  }

  static loginScoped(projects) {
    let projectId = cookie.get('projectId')
    if (!projectId || !projects.find(p => p.id === projectId)) {
      projectId = projects[0].id
    }

    let token = cookie.get('unscopedToken')
    let auth = {
      auth: {
        identity: {
          methods: ['token'],
          token: {
            id: token,
          },
        },
        scope: {
          project: {
            id: projectId,
          },
        },
      },
    }

    Api.setDefaultHeader({ 'X-Auth-Token': null })

    return new Promise((resolve, reject) => {
      Api.sendAjaxRequest({
        url: servicesUrl.identity,
        method: 'POST',
        data: auth,
      }).then((response) => {
        let token = response.headers['X-Subject-Token'] || response.headers['x-subject-token']
        let data = {
          id: response.data.token.user.id,
          name: response.data.token.user.name,
          project: response.data.token.project,
          token,
        }

        cookie.set('token', data.token, { expires: 1 / 24 })
        cookie.set('projectId', data.project.id, { expires: 1 * 30 })
        Api.setDefaultHeader('X-Auth-Token', data.token)

        resolve(data)
      }, reject).catch(reject)
    })
  }

  static tokenLogin() {
    let token = cookie.get('token')
    let projectId = cookie.get('projectId')
    if (token) {
      Api.setDefaultHeader('X-Auth-Token', token)
    }

    return new Promise((resolve, reject) => {
      if (!token || !projectId) {
        reject()
        return
      }
      Api.sendAjaxRequest({
        url: servicesUrl.identity,
        method: 'GET',
        headers: { 'X-Subject-Token': token },
      }).then(resolve, () => {
        cookie.remove('token')
        cookie.remove('projectId')
        Api.resetHeaders()
      }).catch(() => {
        cookie.remove('token')
        cookie.remove('projectId')
        Api.resetHeaders()
      })
    })
  }
}

export default UserSource
