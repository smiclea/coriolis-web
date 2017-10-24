import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Switch } from 'components'

import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'

const Wrapper = styled.div``
const Label = styled.div`
  font-size: 10px;
  font-weight: ${StyleProps.fontWeights.medium};
  color: ${Palette.grayscale[3]};
  text-transform: uppercase;
  margin-bottom: 4px;
`

class Field extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    className: PropTypes.string,
  }

  renderSwitch() {
    return (
      <Switch
        checked={this.props.value}
        onChange={checked => this.props.onChange(checked)}
      />
    )
  }

  renderInput() {
    switch (this.props.type) {
      case 'boolean':
        return this.renderSwitch()
      default:
        return null
    }
  }

  render() {
    return (
      <Wrapper className={this.props.className}>
        <Label>{this.props.label}</Label>
        {this.renderInput()}
      </Wrapper>
    )
  }
}

export default Field
