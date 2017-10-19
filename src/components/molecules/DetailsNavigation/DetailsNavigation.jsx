import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Palette from '../../styleUtils/Palette'

const Wrapper = styled.div`
  margin-left: 100px;
  min-width: 128px;
  max-width: 128px;
`
const Item = styled.div`
  font-size: 16px;
  color: ${props => props.selected ? Palette.primary : Palette.grayscale[4]};
  cursor: pointer;
  margin-bottom: 13px;
`

class DetailsNavigation extends React.Component {
  static propTypes = {
    items: PropTypes.array,
  }

  renderItems() {
    return (
      this.props.items.map(item => <Item selected={item.selected} key={item.label}>{item.label}</Item>)
    )
  }

  render() {
    return (
      <Wrapper>
        {this.renderItems()}
      </Wrapper>
    )
  }
}

export default DetailsNavigation
