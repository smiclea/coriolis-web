import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { MainListFilter, MainList } from 'components'

const Wrapper = styled.div``

class ReplicasList extends React.Component {
  static propTypes = {
    replicas: PropTypes.array,
    endpoints: PropTypes.array,
    onSelectedChange: PropTypes.func,
  }

  render() {
    return (
      <Wrapper>
        <MainListFilter />
        <MainList
          items={this.props.replicas}
          endpoints={this.props.endpoints}
          onSelectedChange={this.props.onSelectedChange}
          type="replica"
        />
      </Wrapper>
    )
  }
}

export default ReplicasList
