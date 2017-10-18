import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Logo } from 'components'

import backgroundImage from './images/star-bg.jpg'

const Wrapper = styled.div`
  background-image: url('${backgroundImage}');
  display: flex;
  flex-direction: column;
  height: 100%;
`

const LogoStyled = styled(Logo)`margin-top: 40px;`

const Menu = styled.div`margin-top:32px`

const MenuItem = styled.div`
  font-size: 18px;
  color: ${props => props.selected ? '#007AFF' : 'white'};
  cursor: pointer;
  margin-top: 26px;
  margin-left: 96px;
  display: inline-block;
`
const Footer = styled.div``

class Navigation extends React.Component {
  static propTypes = {
    currentPage: PropTypes.string,
  }

  handleMenuItemClick(item) {
    window.location.href = `/#/${item}`
  }

  render() {
    return (
      <Wrapper>
        <LogoStyled small />
        <Menu>
          <MenuItem selected={this.props.currentPage === 'replicas'}>Replicas</MenuItem>
          <MenuItem onClick={() => { this.handleMenuItemClick('migrations') }}>Migrations</MenuItem>
          <MenuItem>Cloud Endpoints</MenuItem>
          <MenuItem>Projects</MenuItem>
        </Menu>
        <Footer />
      </Wrapper>
    )
  }
}

export default Navigation
