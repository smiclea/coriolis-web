import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { EndpointLogos, Dropdown } from 'components'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -112px;
  align-items: center;
  margin-bottom: 64px;
`
const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 112px;
`
const EndpointLogosStyled = styled(EndpointLogos) `
  margin-bottom: 32px;
`

class WizardEndpointList extends React.Component {
  static propTypes = {
    providers: PropTypes.array,
    endpoints: PropTypes.array,
    selectedEndpoint: PropTypes.object,
    onChange: PropTypes.func,
  }

  render() {
    return (
      <Wrapper>
        {this.props.providers.map(provider => {
          let endpoints = this.props.endpoints.filter(e => e.type === provider)
          let selectedItem = this.props.selectedEndpoint && this.props.selectedEndpoint.type === provider
            ? this.props.selectedEndpoint : null

          return (
            <Item key={provider}>
              <EndpointLogosStyled height={128} endpoint={provider} />
              <Dropdown
                primary={Boolean(selectedItem)}
                items={endpoints}
                labelField="name"
                noItemsMessage="Add"
                noSelectionMessage="Select"
                centered
                selectedItem={selectedItem}
                onChange={this.props.onChange}
              />
            </Item>
          )
        })}
      </Wrapper>
    )
  }
}

export default WizardEndpointList
