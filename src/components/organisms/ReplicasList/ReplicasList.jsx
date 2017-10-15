import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div``

class ReplicasList extends React.Component {
  static propTypes = {
    replicas: PropTypes.array,
  }

  mock() {
    
  }

  render() {
    return (
      <Wrapper>{this.props.replicas.map(replica => {
        return replica.id
      })}
      </Wrapper>
    )
  }
}

export default ReplicasList
