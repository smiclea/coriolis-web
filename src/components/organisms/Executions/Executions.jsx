import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'

import { Timeline, StatusPill, IdValue, Button, Tasks } from 'components'

import Palette from '../../styleUtils/Palette'

const Wrapper = styled.div`
`
const ExecutionInfo = styled.div`
  background: ${Palette.grayscale[1]};
  padding: 24px 16px;
  display: flex;
  align-items: center;
  margin-top: 16px;
`
const ExecutionInfoNumber = styled.div`
  font-size: 16px;
  padding-right: 24px;
`
const ExecutionInfoDate = styled.div`
  color: ${Palette.grayscale[4]};
  margin-right: 16px;
`
const ExecutionInfoId = styled.div`
  color: ${Palette.grayscale[4]};
  display: flex;
  margin-right: 16px;
  flex-grow: 1;
`

class Executions extends React.Component {
  static propTypes = {
    item: PropTypes.object,
  }

  constructor() {
    super()

    this.state = {
      selectedExecution: null,
    }
  }

  componentWillMount() {
    this.setSelectedExecution(this.props)
  }

  componentWillReceiveProps(props) {
    this.setSelectedExecution(props)
  }

  setSelectedExecution(props) {
    let selectedExecution = this.state.selectedExecution
    let goToLast = false
    let lastExecution = this.getLastExecution(props)

    if (props.item.executions && this.props.item.executions) {
      goToLast = this.props.item.executions.length !== props.item.executions.length
        && lastExecution.status === 'RUNNING'
    }

    if (!selectedExecution || goToLast) {
      this.setState({
        selectedExecution: lastExecution,
      })
    } else if (this.hasExecutions(props)) {
      this.setState({
        selectedExecution: props.item.executions.find(e => e.id === this.state.selectedExecution.id),
      })
    }
  }

  getLastExecution(props) {
    return this.hasExecutions(props) && props.item.executions[props.item.executions.length - 1]
  }

  hasExecutions(props) {
    return props.item.executions && props.item.executions.length
  }

  handlePreviousExecutionClick() {
    let selectedIndex = this.props.item.executions.findIndex(e => e.id === this.state.selectedExecution.id)

    if (selectedIndex === 0) {
      return
    }

    this.setState({ selectedExecution: this.props.item.executions[selectedIndex - 1] })
  }

  handleNextExecutionClick() {
    let selectedIndex = this.props.item.executions.findIndex(e => e.id === this.state.selectedExecution.id)

    if (selectedIndex >= this.props.item.executions.length - 1) {
      return
    }

    this.setState({ selectedExecution: this.props.item.executions[selectedIndex + 1] })
  }

  handleTimelineItemClick(item) {
    this.setState({ selectedExecution: item })
  }

  renderTimeline() {
    if (!this.props.item.executions || !this.props.item.executions.length) {
      return null
    }

    return (
      <Timeline
        items={this.props.item.executions}
        selectedItem={this.state.selectedExecution}
        onPreviousClick={() => { this.handlePreviousExecutionClick() }}
        onNextClick={() => { this.handleNextExecutionClick() }}
        onItemClick={item => { this.handleTimelineItemClick(item) }}
      />
    )
  }

  renderExecutionInfoButton() {
    if (this.state.selectedExecution.status === 'RUNNING') {
      return (<Button secondary hollow>Cancel Execution</Button>)
    }

    return <Button alert hollow>Delete Execution</Button>
  }

  renderExecutionInfo() {
    if (!this.state.selectedExecution) {
      return null
    }

    return (
      <ExecutionInfo>
        <ExecutionInfoNumber>Execution #{this.state.selectedExecution.number}</ExecutionInfoNumber>
        <StatusPill style={{ marginRight: '16px' }} small status={this.state.selectedExecution.status} />
        <ExecutionInfoDate>{moment(this.state.selectedExecution.created_at).format('DD MMMM YYYY HH:mm')}</ExecutionInfoDate>
        <ExecutionInfoId>
          ID:&nbsp;<IdValue width={107} value={this.state.selectedExecution.id} />
        </ExecutionInfoId>
        {this.renderExecutionInfoButton()}
      </ExecutionInfo>
    )
  }

  renderTasks() {
    if (!this.state.selectedExecution || !this.state.selectedExecution.tasks
      || !this.state.selectedExecution.tasks.length) {
      return null
    }

    return (
      <Tasks items={this.state.selectedExecution.tasks} />
    )
  }

  render() {
    return (
      <Wrapper>
        {this.renderTimeline()}
        {this.renderExecutionInfo()}
        {this.renderTasks()}
      </Wrapper>
    )
  }
}

export default Executions
