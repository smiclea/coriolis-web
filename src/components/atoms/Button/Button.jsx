import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Palette } from 'components'

import StyleProps from '../../styleUtils/StyleProps'

const backgroundColor = (props) => {
  if (props.hollow) {
    return 'white'
  }
  if (props.secondary) {
    return Palette.secondary
  }
  return Palette.primary
}

const hoverBackgroundColor = (props) => {
  if (props.secondary) {
    return Palette.grayscale[3]
  }
  if (props.alert) {
    return Palette.alert
  }
  return Palette.primary
}

const border = (props) => {
  if (props.hollow) {
    if (props.secondary) {
      return `border: 1px solid ${Palette.grayscale[3]}`
    }
    if (props.alert) {
      return `border: 1px solid ${Palette.alert}`
    }
    return `border: 1px solid ${Palette.primary}`
  }
  return ''
}

const color = (props) => {
  if (props.hollow) {
    if (props.secondary) {
      return Palette.black
    }
    if (props.alert) {
      return Palette.alert
    }
    return Palette.primary
  }
  return 'white'
}

const StyledButton = styled.button`
  height: 32px;
  border-radius: 4px;
  background-color: ${props => backgroundColor(props)};
  border: none;
  font-size: 14px;
  ${props => border(props)}
  color: ${props => color(props)};
  padding: 0;
  width: ${StyleProps.inputSize.width - 2}px;
  cursor: pointer;
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  &:hover {
    ${props => props.hollow ? 'color: white' : ''}
    background-color: ${props => hoverBackgroundColor(props)};
  }
  &:focus {
    outline: none;
  }
`

const Button = ({ ...props }) => {
  return (
    <StyledButton {...props} />
  )
}

Button.propTypes = {
  children: PropTypes.node,
}

export default Button
