import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  color: white;
  text-transform: uppercase;
  margin-bottom: 6px;
`

const FieldLabel = ({ content }) => {
  return (
    <Wrapper>{content}</Wrapper>
  )
}

FieldLabel.propTypes = {
  content: PropTypes.string.isRequired,
}

export default FieldLabel
