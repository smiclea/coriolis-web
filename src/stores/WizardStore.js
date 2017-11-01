import alt from '../alt'
import WizardActions from '../actions/WizardActions'

class WizardStore {
  constructor() {
    this.data = {}
    this.currentPage = ''

    this.bindListeners({
      handleUpdateData: WizardActions.UPDATE_DATA,
      handleUpdateCurrentPage: WizardActions.UPDATE_CURRENT_PAGE,
    })
  }

  handleUpdateData(data) {
    this.data = {
      ...this.data,
      ...data,
    }
  }

  handleUpdateCurrentPage(page) {
    this.currentPage = page
  }
}

export default alt.createStore(WizardStore)
