import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Palette from '../../styleUtils/Palette'

import searchImage from './images/search.js'

const Wrapper = styled.div`display: flex;`

const Icon = styled.div`
  width: 16px;
  height: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`

class Checkbox extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    primary: PropTypes.bool,
  }

  render() {
    return (
      <Wrapper className={this.props.className} {...this.props}>
        <Icon dangerouslySetInnerHTML={{
          __html: searchImage(this.props.primary ? Palette.primary : Palette.grayscale[4]),
        }}
        />
      </Wrapper>
    )
  }
}

export default Checkbox
