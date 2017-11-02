import React from 'react'
import styled from 'styled-components'
import connectToStores from 'alt-utils/lib/connectToStores'
import PropTypes from 'prop-types'

import {
  WizardTemplate,
  DetailsPageHeader,
  WizardPageContent,
} from 'components'

import UserStore from '../../../stores/UserStore'
import UserActions from '../../../actions/UserActions'
import ProviderActions from '../../../actions/ProviderActions'
import ProviderStore from '../../../stores/ProviderStore'
import EndpointActions from '../../../actions/EndpointActions'
import EndpointStore from '../../../stores/EndpointStore'
import WizardStore from '../../../stores/WizardStore'
import WizardActions from '../../../actions/WizardActions'
import { wizardConfig } from '../../../config'

const Wrapper = styled.div``

class WizardPage extends React.Component {
  static propTypes = {
    userStore: PropTypes.object,
    wizardStore: PropTypes.object,
    providerStore: PropTypes.object,
    endpointStore: PropTypes.object,
    match: PropTypes.object,
  }

  static getStores() {
    return [UserStore, WizardStore, ProviderStore, EndpointStore]
  }

  static getPropsFromStores() {
    return {
      userStore: UserStore.getState(),
      wizardStore: WizardStore.getState(),
      providerStore: ProviderStore.getState(),
      endpointStore: EndpointStore.getState(),
    }
  }

  constructor() {
    super()

    this.state = {
      type: 'migration',
    }
  }

  componentWillMount() {
    let type = this.props.match && this.props.match.params.type
    if (type === 'migration' || type === 'replica') {
      this.setState({ type })
    }
  }

  componentDidMount() {
    document.title = 'Coriolis Wizard'
  }

  loadDataForPage(page) {
    switch (page.id) {
      case 'source':
        ProviderActions.loadProviders()
        EndpointActions.getEndpoints()
        break
      default:
    }
  }

  handleUserItemClick(item) {
    switch (item.value) {
      case 'signout':
        UserActions.logout()
        return
      case 'profile':
        window.location.href = '/#/profile'
        break
      default:
    }
  }

  handleTypeChange(isReplica) {
    this.setState({ type: isReplica ? 'replica' : 'migration' })
  }

  handleBackClick() {
    let currentPageIndex = wizardConfig.pages.findIndex(p => p.id === this.props.wizardStore.currentPage.id)

    if (currentPageIndex === 0) {
      window.history.back()
      return
    }

    let page = wizardConfig.pages[currentPageIndex - 1]
    this.loadDataForPage(page)
    WizardActions.setCurrentPage(page)
  }

  handleNextClick() {
    let currentPageIndex = wizardConfig.pages.findIndex(p => p.id === this.props.wizardStore.currentPage.id)
    let page = wizardConfig.pages[currentPageIndex + 1]
    this.loadDataForPage(page)
    WizardActions.setCurrentPage(page)
  }

  handleSourceEndpointChange(source) {
    WizardActions.updateData({ source })
  }

  handleTargetEndpointChange(target) {
    WizardActions.updateData({ target })
  }

  render() {
    return (
      <Wrapper>
        <WizardTemplate
          pageHeaderComponent={<DetailsPageHeader
            user={this.props.userStore.user}
            onUserItemClick={item => { this.handleUserItemClick(item) }}
          />}
          pageContentComponent={<WizardPageContent
            page={this.props.wizardStore.currentPage}
            providers={this.props.providerStore.providers}
            endpoints={this.props.endpointStore.endpoints}
            wizardData={this.props.wizardStore.data}
            type={this.state.type}
            onTypeChange={isReplica => { this.handleTypeChange(isReplica) }}
            onBackClick={() => { this.handleBackClick() }}
            onNextClick={() => { this.handleNextClick() }}
            onSourceEndpointChange={endpoint => { this.handleSourceEndpointChange(endpoint) }}
            onTargetEndpointChange={endpoint => { this.handleTargetEndpointChange(endpoint) }}
          />}
        />
      </Wrapper>
    )
  }
}

export default connectToStores(WizardPage)
