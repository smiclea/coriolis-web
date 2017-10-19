import React from 'react'
import styled from 'styled-components'

import copyImage from './images/copy.svg'

const Wrapper = styled.span`
  opacity: 1;
  width: 16px;
  height: 16px;
  display: inline-block;
  margin-left: 8px;
  background: url('${copyImage}') no-repeat;
  background-position-y: 4px;
`

class CopyButton extends React.Component {
  render() {
    return (
      <Wrapper {...this.props} />
    )
  }
}

export default CopyButton
