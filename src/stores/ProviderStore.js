import alt from '../alt'
import ProviderActions from '../actions/ProviderActions'

class ProviderStore {
  constructor() {
    this.connectionInfoSchema = []

    this.bindListeners({
      handleGetConnectionInfoSchemaSuccess: ProviderActions.GET_CONNECTION_INFO_SCHEMA_SUCCESS,
    })
  }

  handleGetConnectionInfoSchemaSuccess(schema) {
    this.connectionInfoSchema = schema
  }
}

export default alt.createStore(ProviderStore)
