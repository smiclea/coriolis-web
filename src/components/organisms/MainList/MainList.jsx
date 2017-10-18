import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { MainListItem } from 'components'

import Palette from '../../styleUtils/Palette'

import loadingImage from './images/loading.svg'

const Wrapper = styled.div`
  margin-top: 40px;
`
const Separator = styled.div`
  height: 1px;
  background: ${Palette.grayscale[1]};;
  float: right;
`

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  clear: both;
  margin-top: 88px;
`
const LoadingAnimation = styled.div`
  width: 96px;
  height: 96px;
  background: url('${loadingImage}') center no-repeat;
  animation: rotate 1s linear infinite;

  @keyframes rotate {
    0% {transform: rotate(0deg);}
    100% {transform: rotate(360deg);}
  }
`
const LoadingText = styled.div`
  font-size: 18px;
  margin-top: 39px;
`

const List = styled.div``

const NoResults = styled.div`
  margin-top: 39px;
  text-align: center;
`

class MainList extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    selectedItems: PropTypes.array,
    itemImage: PropTypes.string,
    endpoints: PropTypes.array,
    loading: PropTypes.bool,
    onSelectedChange: PropTypes.func,
    onItemClick: PropTypes.func,
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
          let selected = Boolean(this.props.selectedItems.find(i => i.id === item.id))
          return (
            <MainListItem
              image={this.props.itemImage}
              key={item.id}
              item={item}
              selected={selected}
              onClick={() => { this.props.onItemClick(item) }}
              sourceType={this.getEndpoint(item.origin_endpoint_id).type}
              destinationType={this.getEndpoint(item.destination_endpoint_id).type}
              onSelectedChange={(e) => { this.props.onSelectedChange(item, e.target.checked) }}
            />
          )
        })}
      </List>
    )
  }

  renderLoading() {
    return (
      <Loading>
        <LoadingAnimation />
        <LoadingText>Loading ...</LoadingText>
      </Loading>
    )
  }

  renderNoResults() {
    return (
      <NoResults>No results</NoResults>
    )
  }

  render() {
    let renderContent = () => {
      if (this.props.loading) {
        return this.renderLoading()
      }

      if (this.props.items.length === 0) {
        return this.renderNoResults()
      }

      return this.renderList()
    }

    return (
      <Wrapper>
        {this.props.loading || this.props.items.length === 0 ? <Separator /> : null}
        {renderContent()}
      </Wrapper>
    )
  }
}

export default MainList
