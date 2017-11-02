import alt from '../alt'
import ProviderActions from '../actions/ProviderActions'

class ProviderStore {
  constructor() {
    this.connectionInfoSchema = []
    this.providers = null
    this.providersLoading = false

    this.bindListeners({
      handleGetConnectionInfoSchemaSuccess: ProviderActions.GET_CONNECTION_INFO_SCHEMA_SUCCESS,
      handleLoadProviders: ProviderActions.LOAD_PROVIDERS,
      handleLoadProvidersSuccess: ProviderActions.LOAD_PROVIDERS_SUCCESS,
    })
  }

  handleGetConnectionInfoSchemaSuccess(schema) {
    this.connectionInfoSchema = schema
  }

  handleLoadProviders() {
    this.providers = null
    this.providersLoading = true
  }

  handleLoadProvidersSuccess(providers) {
    this.providers = providers
    this.providersLoading = false
  }
}

export default alt.createStore(ProviderStore)
