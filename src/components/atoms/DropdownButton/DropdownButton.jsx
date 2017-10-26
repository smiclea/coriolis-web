import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import arrowImage from './images/arrow.js'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const Label = styled.div`
  color: ${props => props.primary ? 'white' : Palette.black};
  margin: 7px 32px 0 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  ${props => props.centered ? 'text-align: center;' : ''}
`

const Wrapper = styled.div`
  position: relative;
  width: ${props => props.large ? StyleProps.inputSizes.large.width - 2
    : StyleProps.inputSizes.regular.width - 2}px;
  height: ${props => props.large ? StyleProps.inputSizes.large.height - 2
    : StyleProps.inputSizes.regular.height - 2}px;
  border: 1px solid ${Palette.grayscale[3]};
  border-radius: ${StyleProps.borderRadius};
  cursor: pointer;
  transition: all ${StyleProps.animations.swift};
  background: ${props => props.primary ? Palette.primary : 'white'};

  #dropdown-arrow-image {stroke: ${props => props.primary ? 'white' : Palette.grayscale[4]};}
  &:hover {
    #dropdown-arrow-image {stroke: white;}
    background: ${Palette.primary};
  }

  &:hover ${Label} {
    color: white;
  }
`
const Arrow = styled.div`
  position: absolute;
  right: 8px;
  top: 6px;
`

const DropdownButton = ({ value, onClick, ...props }) => {
  return (
    <Wrapper onClick={onClick} {...props}>
      <Label {...props}>{value}</Label>
      <Arrow {...props} dangerouslySetInnerHTML={{ __html: arrowImage }} />
    </Wrapper>
  )
}

DropdownButton.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
}

export default DropdownButton
