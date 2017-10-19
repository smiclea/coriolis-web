import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Wrapper = styled.div``
const PageHeader = styled.div``
const ContentHeader = styled.div``
const Content = styled.div`
  margin-top: 32px;
`

const DetailsTemplate = (props) => {
  return (
    <Wrapper>
      <PageHeader>{props.pageHeaderComponent}</PageHeader>
      <ContentHeader>{props.contentHeaderComponent}</ContentHeader>
      <Content>{props.contentComponent}</Content>
    </Wrapper>
  )
}

DetailsTemplate.propTypes = {
  pageHeaderComponent: PropTypes.node.isRequired,
  contentHeaderComponent: PropTypes.node.isRequired,
  contentComponent: PropTypes.node.isRequired,
}

export default DetailsTemplate
