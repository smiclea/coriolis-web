import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Palette from '../../styleUtils/Palette'

import arrowImage from './images/arrow.js'

const getOrientation = props => `
  ${props.orientation === 'left' ? 'transform: rotate(180deg);' : ''}
`

const Wrapper = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${props => getOrientation(props)}
`

class Arrow extends React.Component {
  static propTypes = {
    primary: PropTypes.bool,
    orientation: PropTypes.string,
  }

  static defaultProps = {
    orientation: 'right',
  }

  render() {
    return (
      <Wrapper
        {...this.props}
        dangerouslySetInnerHTML={
          { __html: arrowImage(this.props.primary ? Palette.primary : Palette.grayscale[4]) }
        }
      />
    )
  }
}

export default Arrow
