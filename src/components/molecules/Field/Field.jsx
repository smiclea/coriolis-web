import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Switch, TextInput, Dropdown } from 'components'

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
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func,
    className: PropTypes.string,
    minimum: PropTypes.number,
    maximum: PropTypes.number,
    password: PropTypes.bool,
    large: PropTypes.bool,
  }

  renderSwitch() {
    return (
      <Switch
        checked={this.props.value}
        onChange={checked => { this.props.onChange(checked) }}
      />
    )
  }

  renderTextInput() {
    return (
      <TextInput
        type={this.props.password ? 'password' : 'text'}
        large={this.props.large}
        value={this.props.value}
        onChange={e => { this.props.onChange(e.target.value) }}
      />
    )
  }

  renderIntDropdown() {
    let items = []

    for (let i = this.props.minimum; i <= this.props.maximum; i += 1) {
      items.push({
        label: i.toString(),
        value: i,
      })
    }

    return (
      <Dropdown
        large={this.props.large}
        selectedItem={this.props.value}
        items={items}
        onChange={item => this.props.onChange(item)}
      />
    )
  }

  renderInput() {
    switch (this.props.type) {
      case 'boolean':
        return this.renderSwitch()
      case 'string':
        return this.renderTextInput()
      case 'integer':
        if (this.props.minimum || this.props.maximum) {
          return this.renderIntDropdown()
        }
        return this.renderTextInput()
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
