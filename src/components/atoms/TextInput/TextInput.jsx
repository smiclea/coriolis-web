import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const Input = styled.input`
  width: ${props => props.large ? StyleProps.inputSizes.large.width
    : StyleProps.inputSizes.regular.width}px;
  height: ${StyleProps.inputSizes.regular.height}px;
  border-radius: ${StyleProps.borderRadius};
  background-color: #FFF;
  border: 1px solid ${Palette.grayscale[3]};
  color: ${Palette.black};
  padding: 0 8px 0 16px;
  font-size: inherit;
  transition: all ${StyleProps.animations.swift};
  box-sizing: border-box;
  &:hover {
    border-color: ${Palette.primary};
  }
  &:focus {
    border-color: ${Palette.primary};
    outline: none;
  }
  &:disabled {
    color: ${Palette.grayscale[0]};
    border-color: ${Palette.grayscale[0]};
    background-color: ${Palette.grayscale[0]};
  }
  &::placeholder {
    color: ${Palette.grayscale[3]};
  }
`

const TextInput = ({ _ref, ...props }) => {
  return (
    <Input innerRef={_ref} type="text" {...props} />
  )
}

TextInput.propTypes = {
  _ref: PropTypes.func,
}

export default TextInput
