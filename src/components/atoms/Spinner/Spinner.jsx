import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const basics = css`
  border-radius: 50%;
  width: 12px;
  height: 12px;
`

const Wrapper = styled.div`
  ${basics}
  position: relative;
  border-top: 2px solid white;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  border-left: 2px solid #7190CD;
  transform: translateZ(0);
  animation: rotate 2s infinite linear;
  &:after {
    ${basics}
  }

  @keyframes rotate {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
  }
`

const Spinner = ({ className }) => {
  return (
    <Wrapper className={className} />
  )
}

Spinner.propTypes = {
  className: PropTypes.string,
}

export default Spinner
