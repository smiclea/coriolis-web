import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { MainListFilter, MainList } from 'components'

const Wrapper = styled.div`
  height: 100%;
`

class ReplicasList extends React.Component {
  static propTypes = {
    replicas: PropTypes.array,
    endpoints: PropTypes.array,
    onSelectedChange: PropTypes.func,
    onReloadButtonClick: PropTypes.func,
    loading: PropTypes.bool,
  }

  constructor() {
    super()

    this.state = {
      items: [],
      filterStatus: 'all',
      filterText: '',
    }
  }

  componentWillMount() {
    this.setState({ items: this.filterItems(this.props.replicas) })
  }

  componentWillReceiveProps(props) {
    this.setState({ items: this.filterItems(props.replicas) })
  }

  handleFilterItemClick(item) {
    this.setState({
      filterStatus: item.value,
      items: this.filterItems(this.props.replicas, item.value),
    })
  }

  filterItems(items, filterStatus, filterText) {
    items = items || this.state.items
    filterStatus = filterStatus || this.state.filterStatus
    filterText = filterText || this.state.filterText

    let filteredItems = items.filter(item => {
      if (filterStatus === 'all') {
        return true
      }

      let lastExecution = item.executions && item.executions.length ?
        item.executions[item.executions.length - 1] : null

      if (!lastExecution) {
        return false
      }

      return lastExecution.status === filterStatus
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

export default ReplicasList
