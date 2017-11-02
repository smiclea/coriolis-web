import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {
  WizardType,
  Button,
  WizardBreadcrumbs,
  EndpointLogos,
} from 'components'

import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'

import migrationArrowImage from './images/migration.js'

const Wrapper = styled.div`
  ${StyleProps.exactWidth('800px')}
  margin: 64px auto 32px auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  text-align: center;
  font-size: 32px;
  font-weight: ${StyleProps.fontWeights.light};
  color: ${Palette.primary};
`
const Body = styled.div`
  flex-grow: 1;
  overflow-y: auto; 
`
const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  margin-bottom: 80px;
`
const IconRepresentation = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  margin: 0 76px;
`
const Footer = styled.div``
const WizardTypeIcon = styled.div`
  width: 60px;
  height: 32px;
  background: url('data:image/svg+xml;utf8,${props => props.type === 'replica' ? migrationArrowImage(Palette.alert) : migrationArrowImage(Palette.primary)}') center no-repeat;
`

class WizardPageContent extends React.Component {
  static propTypes = {
    page: PropTypes.string,
    type: PropTypes.string,
    onTypeChange: PropTypes.func,
  }

  renderHeader() {
    let title = ''

    switch (this.props.page) {
      case 'type':
        title = `New ${this.props.type.charAt(0).toUpperCase() + this.props.type.substr(1)}`
        break
      default:
    }

    return <Header>{title}</Header>
  }

  renderBody() {
    let body = null

    switch (this.props.page) {
      case 'type':
        body = (
          <WizardType
            selected={this.props.type}
            onChange={this.props.onTypeChange}
          />
        )
        break
      default:
    }

    return <Body>{body}</Body>
  }

  renderNavigationActions() {
    return (
      <Navigation>
        <Button secondary>Back</Button>
        <IconRepresentation>
          <EndpointLogos height={32} />
          <WizardTypeIcon type={this.props.type} />
          <EndpointLogos height={32} />
        </IconRepresentation>
        <Button>Next</Button>
      </Navigation>
    )
  }

  render() {
    if (!this.props.page) {
      return null
    }

    return (
      <Wrapper>
        {this.renderHeader()}
        {this.renderBody()}
        <Footer>
          {this.renderNavigationActions()}
          <WizardBreadcrumbs selected={this.props.page} />
        </Footer>
      </Wrapper>
    )
  }
}

export default WizardPageContent
