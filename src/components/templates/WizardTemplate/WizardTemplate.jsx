import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`
const PageHeader = styled.div``
const PageContent = styled.div`
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
`

const WizardTemplate = (props) => {
  return (
    <Wrapper>
      <PageHeader>{props.pageHeaderComponent}</PageHeader>
      <PageContent>{props.pageContentComponent}</PageContent>
    </Wrapper>
  )
}

WizardTemplate.propTypes = {
  pageHeaderComponent: PropTypes.node.isRequired,
  pageContentComponent: PropTypes.node.isRequired,
}

export default WizardTemplate
