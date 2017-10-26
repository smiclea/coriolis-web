import alt from '../alt'

import ProviderSource from '../sources/ProviderSource'

class ProviderActions {
  getConnectionInfoSchema(providerName) {
    ProviderSource.getConnectionInfoSchema(providerName).then(
      schema => { this.getConnectionInfoSchemaSuccess(schema) },
      response => { this.getConnectionInfoSchemaFailed(response) },
    )
    return true
  }

  getConnectionInfoSchemaSuccess(schema) {
    return schema
  }

  getConnectionInfoSchemaFailed(response) {
    return response || true
  }
}

export default alt.createActions(ProviderActions)
