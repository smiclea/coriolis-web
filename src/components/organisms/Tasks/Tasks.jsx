import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { TaskItem } from 'components'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const ColumnWidths = ['26%', '18%', '36%', '20%']

const Wrapper = styled.div`
  background: ${Palette.grayscale[1]};
`
const Header = styled.div`
  display: flex;
  border-bottom: 1px solid ${Palette.grayscale[5]};
  padding: 4px 8px;
`
const HeaderData = styled.div`
  width: ${props => props.width};
  font-size: 10px;
  color: ${Palette.grayscale[5]};
  font-weight: ${StyleProps.fontWeights.medium};
  text-transform: uppercase;
`
const Body = styled.div``

class Tasks extends React.Component {
  static propTypes = {
    items: PropTypes.array,
  }

  constructor() {
    super()

    this.state = {
      openedItems: [],
    }
  }

  handleItemMouseDown(e) {
    this.dragStartPosition = { x: e.screenX, y: e.screenY }
  }

  handleItemMouseUp(e, item) {
    this.dragStartPosition = this.dragStartPosition || { x: e.screenX, y: e.screenY }

    if (Math.abs(this.dragStartPosition.x - e.screenX) < 3 && Math.abs(this.dragStartPosition.y - e.screenY) < 3) {
      this.toggleItem(item)
    }

    this.dragStartPosition = null
  }

  toggleItem(item) {
    let openedItems = this.state.openedItems
    if (openedItems.find(i => i.id === item.id)) {
      openedItems = openedItems.filter(i => i.id !== item.id)
    } else {
      openedItems = [item]
    }

    this.setState({
      openedItems,
    })
  }

  renderHeader() {
    return (
      <Header>
        <HeaderData width={ColumnWidths[0]}>Task</HeaderData>
        <HeaderData width={ColumnWidths[1]}>Instance</HeaderData>
        <HeaderData width={ColumnWidths[2]}>Latest Message</HeaderData>
        <HeaderData width={ColumnWidths[3]}>Timestamp</HeaderData>
      </Header>
    )
  }

  renderBody() {
    return (
      <Body>
        {this.props.items.map(item => (
          <TaskItem
            onMouseDown={e => this.handleItemMouseDown(e)}
            onMouseUp={e => this.handleItemMouseUp(e, item)}
            key={item.id}
            item={item}
            columnWidths={ColumnWidths}
            open={Boolean(this.state.openedItems.find(i => i.id === item.id))}
          />
        ))}
      </Body>
    )
  }

  render() {
    return (
      <Wrapper>
        {this.renderHeader()}
        {this.renderBody()}
      </Wrapper>
    )
  }
}

export default Tasks
