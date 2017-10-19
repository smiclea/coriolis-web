import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FormFieldLabel, TextInput } from 'components'

import StyleProps from '../../styleUtils/StyleProps'

const Wrapper = styled.div`
  margin-bottom: 16px;
  margin-left: 16px;
`

const StyledTextInput = styled(TextInput) `
  width: ${StyleProps.inputSize.width}px;
`

const LoginFormField = ({ label, ...props }) => {
  return (
    <Wrapper>
      <FormFieldLabel content={label} />
      <StyledTextInput {...props} />
    </Wrapper>
  )
}

LoginFormField.propTypes = {
  label: PropTypes.string,
}

export default LoginFormField
