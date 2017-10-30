import cookie from 'js-cookie'

import Api from '../utils/ApiCaller'

import { servicesUrl } from '../config'
import { SchemaTypes, SchemaParser } from './Schemas'

class ProviderSource {
  static getConnectionInfoSchema(providerName) {
    return new Promise((resolve, reject) => {
      let projectId = cookie.get('projectId')

      Api.sendAjaxRequest({
        url: `${servicesUrl.coriolis}/${projectId}/providers/${providerName}/schemas/${SchemaTypes.CONNECTION_INFO}`,
        method: 'GET',
      }).then(response => {
        let schema = response.data.schemas.connection_info_schema
        schema = SchemaParser.parseConnectionSchema(providerName, schema)
        resolve(schema)
      }, reject).catch(response => { console.error(response); reject(response) })
    })
  }
}

export default ProviderSource
