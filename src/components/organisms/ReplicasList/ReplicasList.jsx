import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FilterList } from 'components'

const Wrapper = styled.div`
  height: 100%;
`

class ReplicasList extends React.Component {
  static propTypes = {
    replicas: PropTypes.array,
  }

  render() {
    return (
      <Wrapper>
        <FilterList
          items={this.props.replicas}
          {...this.props}
        />
      </Wrapper>
    )
  }
}

export default ReplicasList
