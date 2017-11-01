import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const Wrapper = styled.div`
  display: flex;
  height: ${StyleProps.inputSizes.regular.height}px;
  align-items: center;
  ${props => props.disabled ? 'opacity: 0.5;' : ''}
`
const InputWrapper = styled.div`
  position: relative;
  width: ${props => props.big ? 48 : 32}px;
  height: ${props => props.big ? 24 : 16}px;
`
const Input = styled.input`
  position: absolute;
  width: ${props => props.big ? 48 : 32}px;
  height: ${props => props.big ? 24 : 16}px;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
`
const InputBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all ${StyleProps.animations.swift};
  background: ${props => props.checked ? Palette.primary : 'white'};
  border-radius: 50px;
  border: 1px solid ${Palette.primary};
`
const InputThumb = styled.div`
  position: absolute;
  width: ${props => props.big ? 22 : 14}px;
  height: ${props => props.big ? 22 : 14}px;
  transition: all ${StyleProps.animations.swift};
  top: -1px;
  left: ${props => props.checked ? '15px' : '-1px'};
  background: white;
  border: 1px solid ${Palette.primary};
  border-radius: 50%;
`
const Label = styled.div`
  margin-left: 16px;
`

class Switch extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    big: PropTypes.bool,
    checkedLabel: PropTypes.string,
    uncheckedLabel: PropTypes.string,
  }

  static defaultProps = {
    checkedLabel: 'Yes',
    uncheckedLabel: 'No',
  }

  renderInput() {
    return (
      <InputWrapper big={this.props.big}>
        <InputBackground checked={this.props.checked}>
          <InputThumb big={this.props.big} checked={this.props.checked} />
        </InputBackground>
        <Input
          type="checkbox"
          big={this.props.big}
          disabled={this.props.disabled}
          checked={this.props.checked}
          onChange={(e) => this.props.onChange(e.target.checked)}
        />
      </InputWrapper>
    )
  }

  renderLabel() {
    return (
      <Label>{this.props.checked ? this.props.checkedLabel : this.props.uncheckedLabel}</Label>
    )
  }

  render() {
    return (
      <Wrapper disabled={this.props.disabled}>
        {this.renderInput()}
        {this.renderLabel()}
      </Wrapper>
    )
  }
}

export default Switch
