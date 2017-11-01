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
import WizardStore from '../../../stores/WizardStore'
import WizardActions from '../../../actions/WizardActions'
import { wizardConfig } from '../../../config'

const Wrapper = styled.div``

class WizardPage extends React.Component {
  static propTypes = {
    userStore: PropTypes.object,
    wizardStore: PropTypes.object,
    match: PropTypes.object,
  }

  static getStores() {
    return [UserStore, WizardStore]
  }

  static getPropsFromStores() {
    return {
      userStore: UserStore.getState(),
      wizardStore: WizardStore.getState(),
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

    if (!this.props.wizardStore.currentPage) {
      WizardActions.updateCurrentPage(wizardConfig.pages[0])
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
            type={this.state.type}
          />}
        />
      </Wrapper>
    )
  }
}

export default connectToStores(WizardPage)
