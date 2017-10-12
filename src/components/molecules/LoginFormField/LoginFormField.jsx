import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FieldLabel, TextInput } from 'components'

const Wrapper = styled.div`
  margin-bottom: 16px;
  margin-left: 16px;
`

const StyledTextInput = styled(TextInput) `
  width: 192px;
`

const LoginFormField = ({ label, ...props }) => {
  return (
    <Wrapper>
      <FieldLabel content={label} />
      <StyledTextInput {...props} />
    </Wrapper>
  )
}

LoginFormField.propTypes = {
  label: PropTypes.string,
}

export default LoginFormField
