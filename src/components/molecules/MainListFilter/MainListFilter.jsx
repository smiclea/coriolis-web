import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Checkbox, SearchButton } from 'components'

import Palette from '../../styleUtils/Palette'

import reloadImage from './images/reload.svg'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
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

class MainListFilter extends React.Component {
  static propTypes = {
    onFilterItemClick: PropTypes.func,
    onReloadButtonClick: PropTypes.func,
    selectedValue: PropTypes.string,
  }

  getItem(label, value) {
    return {
      label,
      value,
      selected: this.props.selectedValue === value,
    }
  }

  renderFilterGroup() {
    let items = [
      this.getItem('All', 'all'),
      this.getItem('Running', 'RUNNING'),
      this.getItem('Error', 'ERROR'),
      this.getItem('Completed', 'COMPLETED'),
    ]

    return (
      <FilterGroup>
        {items.map(item => {
          return (
            <FilterItem
              onClick={() => this.props.onFilterItemClick(item)}
              key={item.value}
              selected={item.selected}
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
        <Checkbox />
        {this.renderFilterGroup()}
        <ReloadButton onClick={this.props.onReloadButtonClick} />
        <SearchButton />
      </Wrapper>
    )
  }
}

export default MainListFilter
