import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import StyleProps from '../../styleUtils/StyleProps'
import coriolisLogo from './images/coriolis-logo.svg'
import coriolisText from './images/coriolis-text.svg'
import coriolisLogoSmall from './images/coriolis-logo-small.svg'
import coriolisTextSmall from './images/coriolis-text-small.svg'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${StyleProps.media.handheld`
    flex-direction: row;
  `}
  ${props => props.small || props.large ? 'flex-direction: row;' : ''}
`

const CoriolisLogo = styled.div`
  background-image: url('${coriolisLogo}');
  width: 227px;
  height: 204px;
  ${StyleProps.media.handheld`
    display: none;
  `}
  ${props => !props || !props.large ? 'display: none;' : 'display: block;'}
`

const CoriolisText = styled.div`
  background-image: url('${coriolisText}');
  width: 232px;
  height: 41px;
  margin-top: 29px;
  ${StyleProps.media.handheld`
    display: none;
  `}
  ${props => !props || !props.large ? 'display: none;' : 'display: block;'}
`

const CoriolisLogoSmall = styled.div`
  background-image: url('${coriolisLogoSmall}');
  width: 48px;
  height: 42px;
  margin-right: 19px;
  display: none;
  ${StyleProps.media.handheld`
    display: block;
  `}
  ${props => !props || !props.small ? 'display: none;' : 'display: block;'}
`

const CoriolisTextSmall = styled.div`
  background-image: url('${coriolisTextSmall}');
  width: 189px;
  height: 33px;
  display: none;
  ${StyleProps.media.handheld`
    display: block;
  `}
  ${props => !props || !props.small ? 'display: none;' : 'display: block;'}
`

const Logo = ({ className, large, small }) => {
  return (
    <Wrapper className={className} small={small} large={large}>
      <CoriolisLogo large={large} />
      <CoriolisText large={large} />
      <CoriolisLogoSmall small={small} />
      <CoriolisTextSmall small={small} />
    </Wrapper>
  )
}

Logo.propTypes = {
  className: PropTypes.string,
  large: PropTypes.bool,
  small: PropTypes.bool,
}

export default Logo
