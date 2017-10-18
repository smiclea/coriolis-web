import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { MainListFilter, MainList } from 'components'

const Wrapper = styled.div`
`

class FilterList extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    itemImage: PropTypes.string,
    endpoints: PropTypes.array,
    loading: PropTypes.bool,
    onReloadButtonClick: PropTypes.func,
    onItemClick: PropTypes.func,
    type: PropTypes.string,
  }

  constructor() {
    super()

    this.state = {
      items: [],
      filterStatus: 'all',
      filterText: '',
      selectedItems: [],
    }
  }

  componentWillMount() {
    this.setState({ items: this.props.items })
  }

  componentWillReceiveProps(props) {
    this.setState({ items: this.filterItems(props.items) })
  }

  handleFilterItemClick(item) {
    let items = this.filterItems(this.props.items, item.value)
    let selectedItems = this.state.selectedItems.filter(selItem => {
      if (items.find(i => selItem.id === i.id)) {
        return true
      }

      return false
    })

    let selectAllSelected = selectedItems.length > 0 && selectedItems.length === items.length
    this.setState({
      selectedItems,
      selectAllSelected,
      filterStatus: item.value,
      items,
    })
  }

  handleSearchChange(text) {
    this.setState({
      filterText: text,
      items: this.filterItems(this.props.items, null, text),
    })
  }

  filterItems(items, filterStatus, filterText) {
    filterStatus = filterStatus || this.state.filterStatus
    filterText = typeof filterText === 'undefined' ? this.state.filterText : filterText

    let filteredItems = items.filter(item => {
      let lastExecution = item.executions && item.executions.length ?
        item.executions[item.executions.length - 1] : null

      if (
        (filterStatus !== 'all' && (!lastExecution || lastExecution.status !== filterStatus)) ||
        (item.instances[0].toLowerCase().indexOf(filterText) === -1)
      ) {
        return false
      }

      return true
    })

    return filteredItems
  }

  handleItemSelectedChange(item, selected) {
    let items = this.state.selectedItems.slice(0)
    let selectedItems = items.filter(i => item.id !== i.id) || []

    if (selected) {
      selectedItems.push(item)
    }

    this.setState({ selectedItems, selectAllSelected: false })
  }

  handleSelectAllChange(selected) {
    let selectedItems = []
    if (selected) {
      selectedItems = this.state.items.slice(0)
    }

    this.setState({ selectedItems, selectAllSelected: selected })
  }

  render() {
    return (
      <Wrapper>
        <MainListFilter
          type={this.props.type}
          onFilterItemClick={item => { this.handleFilterItemClick(item) }}
          selectedValue={this.state.filterStatus}
          onReloadButtonClick={this.props.onReloadButtonClick}
          onSearchChange={text => { this.handleSearchChange(text) }}
          onSelectAllChange={selected => { this.handleSelectAllChange(selected) }}
          selectAllSelected={this.state.selectAllSelected}
          selectionInfo={{ selected: this.state.selectedItems.length, total: this.state.items.length }}
        />
        <MainList
          loading={this.props.loading}
          items={this.state.items}
          endpoints={this.props.endpoints}
          selectedItems={this.state.selectedItems}
          onSelectedChange={(item, selected) => { this.handleItemSelectedChange(item, selected) }}
          onItemClick={this.props.onItemClick}
          itemImage={this.props.itemImage}
        />
      </Wrapper>
    )
  }
}

export default FilterList
