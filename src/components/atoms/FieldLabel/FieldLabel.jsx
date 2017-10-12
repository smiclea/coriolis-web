import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import StyleProps from '../../styleUtils/StyleProps'

const Wrapper = styled.div`
  color: white;
  text-transform: uppercase;
  margin-bottom: 6px;
  font-weight: ${StyleProps.fontWeights.medium};
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
