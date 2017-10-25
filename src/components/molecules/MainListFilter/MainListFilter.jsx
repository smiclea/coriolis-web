import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Checkbox, SearchInput, Dropdown } from 'components'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

import reloadImage from './images/reload.svg'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 8px;
  flex-wrap: wrap;
`
const Main = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
  flex-grow: 1;
  margin-bottom: 32px;
`
const FilterGroup = styled.div`
  display: flex;
  margin: 0 16px 0 32px;
  border-right: 1px solid ${Palette.grayscale[4]};
`
const FilterItem = styled.div`
  margin-right: 32px;
  color: ${props => props.selected ? Palette.primary : Palette.grayscale[4]};
  ${props => props.selected ? 'text-decoration: underline;' : ''}
  cursor: pointer;
  white-space: nowrap;

  &:last-child {
    margin-right: 16px;
  }
`
const ReloadButton = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 16px;
  background: url('${reloadImage}') no-repeat center;
  cursor: pointer;
`
const Selection = styled.div`
  display: flex;
  align-items: center;
  opacity: ${props => props.show ? 1 : 0};
  transition: all ${StyleProps.animations.swift};
  margin-bottom: 32px;
`
const SelectionText = styled.div`
  margin-right: 16px;
  color: ${Palette.grayscale[4]};
  white-space: nowrap;
`

class MainListFilter extends React.Component {
  static propTypes = {
    onFilterItemClick: PropTypes.func,
    onReloadButtonClick: PropTypes.func,
    onSearchChange: PropTypes.func,
    onSelectAllChange: PropTypes.func,
    onActionChange: PropTypes.func,
    actions: PropTypes.array,
    selectedValue: PropTypes.string,
    selectionInfo: PropTypes.object,
    selectAllSelected: PropTypes.bool,
    items: PropTypes.array,
  }

  renderFilterGroup() {
    return (
      <FilterGroup>
        {this.props.items.map(item => {
          return (
            <FilterItem
              onClick={() => this.props.onFilterItemClick(item)}
              key={item.value}
              selected={this.props.selectedValue === item.value}
            >{item.label}
            </FilterItem>
          )
        })}
      </FilterGroup>
    )
  }

  render() {
    return (
      <Wrapper>
        <Main>
          <Checkbox
            onChange={(e) => { this.props.onSelectAllChange(e.target.checked) }}
            checked={!!this.props.selectAllSelected}
          />
          {this.renderFilterGroup()}
          <ReloadButton onClick={this.props.onReloadButtonClick} />
          <SearchInput onChange={this.props.onSearchChange} />
        </Main>
        <Selection show={this.props.selectionInfo.selected}>
          <SelectionText>
            {this.props.selectionInfo.selected} of {this.props.selectionInfo.total}&nbsp;
            {this.props.selectionInfo.label}(s) selected
          </SelectionText>
          <Dropdown
            small
            noSelectionMessage="Select an action"
            items={this.props.actions}
            onChange={item => { this.props.onActionChange(item.value) }}
          />
        </Selection>
      </Wrapper>
    )
  }
}

export default MainListFilter
