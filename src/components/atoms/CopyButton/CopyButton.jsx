import React from 'react'
import styled from 'styled-components'

import StyleProps from '../../styleUtils/StyleProps'

import copyImage from './images/copy.svg'

const Wrapper = styled.span`
  opacity: 0;
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url('${copyImage}') no-repeat;
  background-position-y: 1px;
  transition: all ${StyleProps.animations.swift};
`

class CopyButton extends React.Component {
  render() {
    return (
      <Wrapper {...this.props} />
    )
  }
}

export default CopyButton
