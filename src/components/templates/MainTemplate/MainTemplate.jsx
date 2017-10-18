import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`
const Navigation = styled.div`
  flex: 0 0 320px;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  height: 100%;
`
const List = styled.div`
  margin: 0 64px 0 32px;
  overflow: auto;
  height: 100%;
`
const Header = styled.div`
  min-width: 675px;
`

const MainTemplate = (props) => {
  return (
    <Wrapper>
      <Navigation>{props.navigationComponent}</Navigation>
      <Content>
        <Header>{props.headerComponent}</Header>
        <List>{props.listComponent}</List>
      </Content>
    </Wrapper>
  )
}

MainTemplate.propTypes = {
  navigationComponent: PropTypes.node.isRequired,
  listComponent: PropTypes.node.isRequired,
  headerComponent: PropTypes.node.isRequired,
}

export default MainTemplate
