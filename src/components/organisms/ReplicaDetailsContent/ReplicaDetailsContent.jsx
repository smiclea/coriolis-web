import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { DetailsNavigation, MainDetails } from 'components'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`

class ReplicaDetailsContent extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    endpoints: PropTypes.array,
  }

  render() {
    let navigationItems = [{
      label: 'Replica',
      selected: true,
    }, {
      label: 'Executions',
    }, {
      label: 'Schedule',
    }]

    return (
      <Wrapper>
        <DetailsNavigation items={navigationItems} />
        <MainDetails item={this.props.item} endpoints={this.props.endpoints} />
      </Wrapper>
    )
  }
}

export default ReplicaDetailsContent
