import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Checkbox } from 'components'
import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

import replicaImage from './images/replica.svg'

const CheckboxStyled = styled(Checkbox) `
  opacity: ${props => { console.log(props); return props.checked ? 1 : 0}};
  transition: all ${StyleProps.animations.swift};
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  &:hover ${CheckboxStyled} {
    opacity: 1;
  }
`

const Content = styled.div`
  display: flex;
  align-items: center;
  margin-left: 32px;
  border-top: 1px solid ${Palette.grayscale[1]};
  padding: 8px 16px;
  cursor: pointer;
  flex-grow: 1;
  transition: all ${StyleProps.animations.swift};

  &:hover {
    background: ${Palette.grayscale[1]};
  }
`

const Image = styled.div`
  width: 48px;
  height: 48px;
  background: url('${replicaImage}') no-repeat center;
  margin-right: 16px;
`
const Title = styled.div``
const TitleLabel = styled.div`
  font-size: 16px;
`
const EndpointsImages = styled.div``
const LastExecution = styled.div``
const TasksRemaining = styled.div``

class MainListItem extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    type: PropTypes.string,
    sourceType: PropTypes.string,
    destinationType: PropTypes.string,
    onSelectedChange: PropTypes.func,
  }

  getLastExecution() {
    if (this.props.item.executions && this.props.item.executions.length) {
      return this.props.item.executions[this.props.item.executions.length - 1]
    }

    return {}
  }

  getStatus() {
    let lastExecution = this.getLastExecution()
    if (lastExecution) {
      return lastExecution.status
    }

    return null
  }

  getLastExecutionTime() {
    let lastExecution = this.getLastExecution()
    if (lastExecution) {
      return lastExecution.updated_at
    }

    return null
  }

  getTasksRemaining() {
    let lastExecution = this.getLastExecution()

    if (!lastExecution || !lastExecution.tasks || lastExecution.tasks.length === 0) {
      return '-'
    }

    let unfinished = lastExecution.tasks.filter(task => task.status !== 'COMPLETED').length

    if (unfinished === 0) {
      return '-'
    }

    let total = lastExecution.tasks.length

    return `${unfinished} of ${total}`
  }

  render() {
    return (
      <Wrapper>
        <CheckboxStyled
          checked={this.props.item.selected}
          onChange={this.props.onSelectedChange}
        />
        <Content>
          <Image type={this.props.type} />
          <Title>
            <TitleLabel>{this.props.item.instances[0]}</TitleLabel>
            <div>{this.getStatus()}</div>
          </Title>
          <EndpointsImages>{this.props.sourceType} - {this.props.destinationType}</EndpointsImages>
          <LastExecution>{this.getLastExecutionTime()}</LastExecution>
          <TasksRemaining>{this.getTasksRemaining()}</TasksRemaining>
        </Content>
      </Wrapper>
    )
  }
}

export default MainListItem
