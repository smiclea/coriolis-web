import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const Wrapper = styled.div`
  background: white;
`
const Progress = styled.div`
  height: 2px;
  background: ${Palette.primary};
  transition: all ${StyleProps.animations.swift};
  width: ${props => props.width}%;
`

class ProgressBar extends React.Component {
  static propTypes = {
    progress: PropTypes.number,
  }

  render() {
    return (
      <Wrapper {...this.props}>
        <Progress width={this.props.progress} />
      </Wrapper>
    )
  }
}

export default ProgressBar
