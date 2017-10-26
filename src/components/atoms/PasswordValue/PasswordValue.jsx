import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import StyleProps from '../../styleUtils/StyleProps'

import eyeImage from './images/eye.svg'

const EyeIcon = styled.span`
  opacity: 0;
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url('${eyeImage}') no-repeat;
  background-position-y: 2px;
  transition: all ${StyleProps.animations.swift};
`
const Wrapper = styled.div`
  cursor: ${props => props.show ? '' : 'pointer'};
  display: inline-block;
  &:hover > ${EyeIcon} {
    opacity: 1;
  }
`
const Value = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  margin-right: 4px;
`

class PasswordValue extends React.Component {
  static propTypes = {
    value: PropTypes.string,
  }

  constructor() {
    super()

    this.state = {
      show: false,
    }
  }

  handleShowClick() {
    this.setState({ show: true })
  }

  render() {
    return (
      <Wrapper onClick={() => { this.handleShowClick() }} show={this.state.show}>
        <Value>{this.state.show ? this.props.value : '•••••••••'}</Value>
        {!this.state.show ? <EyeIcon /> : null}
      </Wrapper>
    )
  }
}

export default PasswordValue
