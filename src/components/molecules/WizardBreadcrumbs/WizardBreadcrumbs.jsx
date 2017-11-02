import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Arrow } from 'components'

import { wizardConfig } from '../../../config'
import Palette from '../../styleUtils/Palette'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`
const ArrowStyled = styled(Arrow)``
const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  margin-right: 6px;

  &:last-child ${ArrowStyled} {
    display: none;
  }
`
const Name = styled.div`
  color: ${props => props.selected ? Palette.primary : Palette.black};
`

class WizardBreadcrumbs extends React.Component {
  static propTypes = {
    selected: PropTypes.string,
  }

  getLabel(name) {
    let label = ''
    switch (name) {
      case 'type':
        label = 'Type'
        break
      case 'source':
        label = 'Source Cloud'
        break
      case 'target':
        label = 'Target Cloud'
        break
      case 'vms':
        label = 'Select VMs'
        break
      case 'networks':
        label = 'Networks'
        break
      case 'options':
        label = 'Options'
        break
      case 'schedule':
        label = 'Schedule'
        break
      case 'summary':
        label = 'Summary'
        break
      default:
    }

    return label
  }

  render() {
    return (
      <Wrapper>
        {wizardConfig.pages.map(pageName => {
          return (
            <Breadcrumb key={pageName}>
              <Name selected={this.props.selected === pageName}>{this.getLabel(pageName)}</Name>
              <ArrowStyled primary={this.props.selected === pageName} useDefaultCursor />
            </Breadcrumb>
          )
        })}
      </Wrapper>
    )
  }
}

export default WizardBreadcrumbs
