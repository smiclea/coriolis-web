import alt from '../alt'
import EndpointActions from '../actions/EndpointActions'

class EndpointStore {
  constructor() {
    this.endpoints = []
    this.loading = false
    this.connectionInfo = null
    this.validation = null
    this.validating = false
    this.updating = false
    this.adding = false

    this.bindListeners({
      handleGetEndpoints: EndpointActions.GET_ENDPOINTS,
      handleGetEndpointsCompleted: EndpointActions.GET_ENDPOINTS_COMPLETED,
      handleGetEndpointsFailed: EndpointActions.GET_ENDPOINTS_FAILED,
      handleDeleteSuccess: EndpointActions.DELETE_SUCCESS,
      handleGetConnectionInfoSuccess: EndpointActions.GET_CONNECTION_INFO_SUCCESS,
      handleValidate: EndpointActions.VALIDATE,
      handleValidateSuccess: EndpointActions.VALIDATE_SUCCESS,
      handleValidateFailed: EndpointActions.VALIDATE_FAILED,
      handleClearValidation: EndpointActions.CLEAR_VALIDATION,
      handleUpdateSuccess: EndpointActions.UPDATE_SUCCESS,
      handleUpdate: EndpointActions.UPDATE,
      handleClearConnectionInfo: EndpointActions.CLEAR_CONNECTION_INFO,
      handleAdd: EndpointActions.ADD,
      handleAddSuccess: EndpointActions.ADD_SUCCESS,
      handleAddFailed: EndpointActions.ADD_FAILED,
    })
  }

  handleGetEndpoints() {
    this.loading = true
  }

  handleGetEndpointsCompleted(endpoints) {
    this.endpoints = endpoints
    this.loading = false
  }

  handleGetEndpointsFailed() {
    this.loading = false
  }

  handleDeleteSuccess(endpointId) {
    this.endpoints = this.endpoints.filter(e => e.id !== endpointId)
  }

  handleGetConnectionInfoSuccess(connectionInfo) {
    this.connectionInfo = connectionInfo
  }

  handleValidate() {
    this.validating = true
  }

  handleValidateSuccess(validation) {
    this.validation = validation
    this.validating = false
  }

  handleValidateFailed() {
    this.validating = false
    this.validation = { valid: false }
  }

  handleClearValidation() {
    this.validating = false
    this.validation = null
  }

  handleUpdate() {
    this.updating = true
  }

  handleUpdateSuccess(endpoint) {
    this.endpoints = this.endpoints.map(e => {
      if (e.id === endpoint.id) {
        return endpoint
      }
      return e
    })

    this.updating = false
    this.connectionInfo = endpoint.connection_info
  }

  handleClearConnectionInfo() {
    this.connectionInfo = null
  }

  handleAdd() {
    this.adding = true
  }

  handleAddSuccess(endpoint) {
    this.endpoints = [
      endpoint,
      ...this.endpoints,
    ]

    this.connectionInfo = endpoint.connection_info
    this.adding = false
  }

  handleAddFailed() {
    this.adding = false
  }
}

export default alt.createStore(EndpointStore)
