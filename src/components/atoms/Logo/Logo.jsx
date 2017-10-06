import React from 'react'
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
  ${StyleProps.media.handheld`
    flex-direction: row;
  `}
`

const CoriolisLogo = styled.div`
  background-image: url('${coriolisLogo}');
  width: 227px;
  height: 204px;
  ${StyleProps.media.handheld`
    display: none;
  `}
`

const CoriolisText = styled.div`
  background-image: url('${coriolisText}');
  width: 232px;
  height: 41px;
  margin-top: 29px;
  ${StyleProps.media.handheld`
    display: none;
  `}
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
`

const CoriolisTextSmall = styled.div`
  background-image: url('${coriolisTextSmall}');
  width: 189px;
  height: 33px;
  display: none;
  ${StyleProps.media.handheld`
    display: block;
  `}
`

const Logo = () => {
  return (
    <Wrapper>
      <CoriolisLogo />
      <CoriolisText />
      <CoriolisLogoSmall />
      <CoriolisTextSmall />
    </Wrapper>
  )
}

export default Logo
