import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Wrapper = styled.div`
  display: flex;
`
const Navigation = styled.div`width: 320px`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`
const List = styled.div``
const Header = styled.div``

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
