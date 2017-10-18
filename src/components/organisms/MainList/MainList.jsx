import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { MainListItem } from 'components'

const Wrapper = styled.div`
  margin-top: 40px;
  overflow: auto;
`

const List = styled.div``

class MainList extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    type: PropTypes.string,
    endpoints: PropTypes.array,
    onSelectedChange: PropTypes.func,
  }

  getEndpoint(endpointId) {
    if (!this.props.endpoints || this.props.endpoints.length === 0) {
      return {}
    }

    return this.props.endpoints.find(endpoint => endpoint.id === endpointId) || {}
  }

  renderList() {
    if (!this.props.items || this.props.items.length === 0) {
      return null
    }

    return (
      <List>
        {this.props.items.map(item => {
          return (
            <MainListItem
              key={item.id}
              type={this.props.type}
              item={item}
              sourceType={this.getEndpoint(item.origin_endpoint_id).type}
              destinationType={this.getEndpoint(item.destination_endpoint_id).type}
              onSelectedChange={(e) => { this.props.onSelectedChange(item, e.target.checked) }}
            />
          )
        })}
      </List>
    )
  }

  render() {
    return (
      <Wrapper>
        {this.renderList()}
      </Wrapper>
    )
  }
}

export default MainList
