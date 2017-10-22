import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import { Arrow, StatusIcon } from 'components'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const ArrowStyled = styled(Arrow) `
  opacity: 0;
  position: absolute;
  top: 0;
  transition: all ${StyleProps.animations.swift};
  ${props => props.orientation === 'left' ? 'left: -19px;' : ''}
  ${props => props.orientation === 'right' ? 'right: -19px;' : ''}
`
const Wrapper = styled.div`
  position: relative;
  height: 30px;
  user-select: none;
  &:hover ${ArrowStyled} {
    opacity: 1;
  }
`
const MainLine = styled.div`
  width: 100%;
  padding-top: 7px;
  display: flex;
`
const ProgressLine = styled.div`
  border-bottom: 2px solid ${Palette.primary};
  transition: all ${StyleProps.animations.swift};
`
const EndLine = styled.div`
  border-bottom: 2px solid ${Palette.grayscale[2]};
  transition: all ${StyleProps.animations.swift};
`
const ItemsWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`
const Items = styled.div`
  display: flex;
`
const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 90px;
  cursor: pointer;
  min-width: 75px;
  max-width: 75px;
`
const ItemLabel = styled.div`
  font-size: 12px;
  color: ${Palette.grayscale[4]};
  margin-top: 2px;
  ${props => props.selected ? `color: ${Palette.black};` : ''}
  ${props => props.selected ? `font-weight: ${StyleProps.fontWeights.medium};` : ''}
`

class Timeline extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    selectedItem: PropTypes.object,
    onPreviousClick: PropTypes.func,
    onNextClick: PropTypes.func,
    onItemClick: PropTypes.func,
  }

  componentDidMount() {
    this.moveToSelectedItem()
    this.itemsRef.style.transition = `all ${StyleProps.animations.swift}`
  }

  componentDidUpdate() {
    this.moveToSelectedItem()
  }

  moveToSelectedItem() {
    if (!this.itemRef || !this.props.selectedItem) {
      return
    }

    let itemIndex = this.props.items.findIndex(i => i.id === this.props.selectedItem.id)
    let halfWidth = this.wrapperRef.offsetWidth / 2
    let itemGap = this.itemRef.offsetWidth + 90
    let itemHalfWidth = this.itemRef.offsetWidth / 2
    let offset = (halfWidth - (itemGap * itemIndex)) - itemHalfWidth

    this.itemsRef.style.marginLeft = `${offset}px`

    let lastItemPos = (itemGap * (this.props.items.length - 1)) + offset + itemHalfWidth
    this.progressLineRef.style.width = `${lastItemPos}px`
    this.endLineRef.style.width = `${Math.max(this.wrapperRef.offsetWidth - lastItemPos, 0)}px`
  }

  renderMainLine() {
    return (
      <MainLine>
        <ProgressLine innerRef={line => { this.progressLineRef = line }} />
        <EndLine innerRef={line => { this.endLineRef = line }} />
      </MainLine>
    )
  }

  renderItems() {
    return (
      <ItemsWrapper>
        <Items innerRef={items => { this.itemsRef = items }}>
          {this.props.items.map(item => (
            <Item
              key={item.id}
              innerRef={item => { this.itemRef = item }}
              onClick={() => { this.props.onItemClick(item) }}
            >
              <StatusIcon status={item.status} useBackground />
              <ItemLabel selected={this.props.selectedItem && this.props.selectedItem.id === item.id}>
                {moment(item.created_at).format('DD MMM YYYY')}
              </ItemLabel>
            </Item>
          ))}
        </Items>
      </ItemsWrapper>
    )
  }

  render() {
    return (
      <Wrapper innerRef={w => { this.wrapperRef = w }}>
        <ArrowStyled
          orientation="left"
          primary
          onClick={this.props.onPreviousClick}
        />
        {this.renderMainLine()}
        {this.renderItems()}
        <ArrowStyled
          orientation="right"
          onClick={this.props.onNextClick}
        />
      </Wrapper>
    )
  }
}

export default Timeline
