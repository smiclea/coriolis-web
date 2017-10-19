import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Wrapper = styled.div`
  display: flex;
`

const EmptyTemplate = (props) => {
  return (
    <Wrapper>
      {props.children}
    </Wrapper>
  )
}

EmptyTemplate.propTypes = {
  children: PropTypes.node.isRequired,
}

export default EmptyTemplate
