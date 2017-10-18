import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'

import { Checkbox, StatusPill, EndpointLogos } from 'components'
import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

import replicaImage from './images/replica.svg'
import arrowImage from './images/arrow.svg'

const CheckboxStyled = styled(Checkbox) `
  opacity: 0;
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
  border-bottom: 1px solid ${Palette.grayscale[1]};
  padding: 8px 16px;
  cursor: pointer;
  flex-grow: 1;
  transition: all ${StyleProps.animations.swift};
  min-width: 785px;

  &:hover {
    background: ${Palette.grayscale[1]};
  }
`

const Image = styled.div`
  min-width: 48px;
  height: 48px;
  background: url('${replicaImage}') no-repeat center;
  margin-right: 16px;
`
const Title = styled.div`
  flex-grow: 1;
  overflow: hidden;
  margin-right: 48px;
  min-width: 100px;
`
const TitleLabel = styled.div`
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const EndpointsImages = styled.div`
  display: flex;
  align-items: center;
  margin-right: 48px;
`
const EndpointImageArrow = styled.div`
  width: 16px;
  height: 16px;
  margin: 0 16px;
  background: url('${arrowImage}') center no-repeat;
`
const LastExecution = styled.div`
  min-width: 175px;
  margin-right: 25px;
`
const ItemLabel = styled.div`
  color: ${Palette.grayscale[4]};
`
const ItemValue = styled.div`
  color: ${Palette.primary};
`

const TasksRemaining = styled.div`
  min-width: 114px;
`

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
    let endpointImages = this.props.sourceType && this.props.destinationType ? (
      <EndpointsImages>
        <EndpointLogos small endpoint={this.props.sourceType} />
        <EndpointImageArrow />
        <EndpointLogos small endpoint={this.props.destinationType} />
      </EndpointsImages>
    ) : null
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
            {this.getStatus() ? <StatusPill status={this.getStatus()} /> : null}
          </Title>
          {endpointImages}
          <LastExecution>
            <ItemLabel>Last Execution</ItemLabel>
            <ItemValue>{moment(this.getLastExecutionTime()).format('DD MMMM YYYY, HH:mm')}</ItemValue>
          </LastExecution>
          <TasksRemaining>
            <ItemLabel>Tasks Remaining</ItemLabel>
            <ItemValue>{this.getTasksRemaining()}</ItemValue>
          </TasksRemaining>
        </Content>
      </Wrapper>
    )
  }
}

export default MainListItem
