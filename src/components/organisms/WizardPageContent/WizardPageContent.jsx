import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {
  WizardType,
  Button,
  Breadcrumbs,
} from 'components'

import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'

const Wrapper = styled.div`
  ${StyleProps.exactWidth('800px')}
  margin: 90px auto 32px auto;
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
`
const IconRepresentation = styled.div``
const Footer = styled.div``

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
        <IconRepresentation />
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
          <Breadcrumbs />
        </Footer>
      </Wrapper>
    )
  }
}

export default WizardPageContent
