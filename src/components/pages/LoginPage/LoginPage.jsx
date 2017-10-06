import React from 'react'
import styled from 'styled-components'

import { LoginTemplate, Logo, LoginForm } from 'components'
import StyleProps from '../../styleUtils/StyleProps'
import backgroundImage from './images/star-bg.jpg'

const Wrapper = styled.div`
  background-image: url('${backgroundImage}');
  background-color: transparent;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 142px;
  ${StyleProps.media.handheld`
    margin-top: 48px;
  `}
`

const StyledLoginForm = styled(LoginForm) `
  margin-top: 48px;
  ${StyleProps.media.handheld`
    margin-top: 32px;
  `}
`

const LoginPage = () => {
  return (
    <LoginTemplate>
      <Wrapper>
        <Content>
          <Logo />
          <StyledLoginForm />
        </Content>
      </Wrapper>
    </LoginTemplate>
  )
}

export default LoginPage
