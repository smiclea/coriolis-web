import React from 'react'
import styled, { css } from 'styled-components'

import StyleProps from '../../styleUtils/StyleProps'

import hamburgerImage from './images/hamburger'
import backgroundImage from './images/star-bg.jpg'

const Wrapper = styled.div`
  margin-right: 20px;
`

const OpenTopLayer = css`
  transform: rotate(45deg) translateX(3px);
`

const OpenMiddleLayer = css`
  transform: rotate(-45deg) translateY(7px) translateX(-4px);
`

const Close = css`
  transform: rotate(0) translateY(0) translateX(0);
  opacity: 1;
`

const OpenBottomLayer = css`
  opacity: 0;
`

const Hamburger = styled.div`
  cursor: pointer;
  #top-layer, #middle-layer, #bottom-layer {
    transition: all ${StyleProps.animations.swift};
  }
  #top-layer {
    ${props => props.open ? OpenTopLayer : Close};
  }
  #middle-layer {
    transform-origin: 0% 100%;
    ${props => props.open ? OpenMiddleLayer : Close};
  }
  #bottom-layer {
    ${props => props.open ? OpenBottomLayer : Close};
  }
`
const Menu = styled.div`
  position: fixed;
  background: url('${backgroundImage}');
  top: 64px;
  left: ${props => props.open ? 0 : '-224px'};
  bottom: 0;
  width: 184px;
  padding-left: 40px;
  padding-top: 60px;
  transition: all ${StyleProps.animations.swift};
`
const MenuItem = styled.div`
  font-size: 18px;
  color: white;
  margin-bottom: 24px;
  cursor: pointer;
`

class SideMenu extends React.Component {
  constructor() {
    super()

    this.state = {
      open: false,
    }
  }

  handleHamburgerClick() {
    this.setState({ open: !this.state.open })
  }

  render() {
    return (
      <Wrapper>
        <Hamburger
          open={this.state.open}
          onClick={() => { this.handleHamburgerClick() }}
          dangerouslySetInnerHTML={{ __html: hamburgerImage() }}
        />
        <Menu open={this.state.open}>
          <MenuItem onClick={() => { this.handleMenuItemClick('replicas') }}>Replicas</MenuItem>
          <MenuItem onClick={() => { this.handleMenuItemClick('migrations') }}>Migrations</MenuItem>
          <MenuItem onClick={() => { this.handleMenuItemClick('endpoints') }}>Cloud Endpoints</MenuItem>
          <MenuItem onClick={() => { this.handleMenuItemClick('projects') }}>Projects</MenuItem>
        </Menu>
      </Wrapper>
    )
  }
}

export default SideMenu
