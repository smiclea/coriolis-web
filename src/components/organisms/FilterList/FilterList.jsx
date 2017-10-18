import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { MainListFilter, MainList } from 'components'

const Wrapper = styled.div`
  height: 100%;
`

class FilterList extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    endpoints: PropTypes.array,
    loading: PropTypes.bool,
    onReloadButtonClick: PropTypes.func,
    onSelectedChange: PropTypes.func,
  }

  constructor() {
    super()

    this.state = {
      items: [],
      filterStatus: 'all',
      filterText: '',
    }
  }

  componentWillReceiveProps(props) {
    this.setState({ items: this.filterItems(props.items) })
  }

  handleFilterItemClick(item) {
    this.setState({
      filterStatus: item.value,
      items: this.filterItems(this.props.items, item.value),
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

  render() {
    return (
      <Wrapper>
        <MainListFilter
          onFilterItemClick={item => { this.handleFilterItemClick(item) }}
          selectedValue={this.state.filterStatus}
          onReloadButtonClick={this.props.onReloadButtonClick}
          onSearchChange={text => { this.handleSearchChange(text) }}
        />
        <MainList
          loading={this.props.loading}
          items={this.state.items}
          endpoints={this.props.endpoints}
          onSelectedChange={this.props.onSelectedChange}
          type="replica"
        />
      </Wrapper>
    )
  }
}

export default FilterList
