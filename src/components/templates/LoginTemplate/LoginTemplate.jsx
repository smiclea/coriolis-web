import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Wrapper = styled.div`
  display: flex;
`

const LoginTemplate = (props) => {
  return (
    <Wrapper>
      {props.children}
    </Wrapper>
  )
}

LoginTemplate.propTypes = {
  children: PropTypes.node.isRequired,
}

export default LoginTemplate
