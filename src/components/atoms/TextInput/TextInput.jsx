import React from 'react'
import styled from 'styled-components'
import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const Input = styled.input`
  height: ${StyleProps.inputSize.height - 2}px;
  border-radius: ${StyleProps.borderRadius - 2}px;
  background-color: #FFF;
  border: 1px solid ${Palette.grayscale[3]};
  font-size: 14px;
  color: ${Palette.grayscale[4]};
  padding: 0 8px 0 16px;
  font-weight: ${StyleProps.fontWeights.light};
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
`

const TextInput = ({ ...props }) => {
  return (
    <Input type="text" {...props} />
  )
}

export default TextInput
