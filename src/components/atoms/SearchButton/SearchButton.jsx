import React from 'react'
import styled from 'styled-components'

import searchImage from './images/search.svg'

const Wrapper = styled.div`display: flex;`

const Icon = styled.div`
  width: 16px;
  height: 16px;
  background: url('${searchImage}') no-repeat center;
  cursor: pointer;
`

class Checkbox extends React.Component {
  render() {
    return (
      <Wrapper>
        <Icon />
      </Wrapper>
    )
  }
}

export default Checkbox
