import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const Wrapper = styled.div`
  display: flex;
  height: ${StyleProps.inputSizes.regular.height}px;
  align-items: center;
`
const InputWrapper = styled.div`
  position: relative;
  width: 32px;
  height: 16px;
`
const Input = styled.input`
  position: absolute;
  width: 32px;
  height: 16px;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: pointer;
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
  width: 14px;
  height: 14px;
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
    checkedLabel: PropTypes.string,
    uncheckedLabel: PropTypes.string,
  }

  static defaultProps = {
    checkedLabel: 'Yes',
    uncheckedLabel: 'No',
  }

  renderInput() {
    return (
      <InputWrapper>
        <InputBackground checked={this.props.checked}>
          <InputThumb checked={this.props.checked} />
        </InputBackground>
        <Input
          type="checkbox"
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
      <Wrapper>
        {this.renderInput()}
        {this.renderLabel()}
      </Wrapper>
    )
  }
}

export default Switch
