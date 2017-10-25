import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { DetailsNavigation, MainDetails, Button, Executions } from 'components'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`

const Buttons = styled.div`
  & > button:last-child {
    float: right;
  }
`
const DetailsBody = styled.div`
  min-width: 800px;
  max-width: 800px;
`

const NavigationItems = [
  {
    label: 'Replica',
    value: '',
  }, {
    label: 'Executions',
    value: 'executions',
  }, {
    label: 'Schedule',
    value: 'schedule',
  },
]

class ReplicaDetailsContent extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    endpoints: PropTypes.array,
    page: PropTypes.string,
    onCancelExecutionClick: PropTypes.func,
    onDeleteExecutionClick: PropTypes.func,
    onExecuteClick: PropTypes.func,
    onCreateMigrationClick: PropTypes.func,
    onDeleteReplicaClick: PropTypes.func,
  }

  getLastExecution() {
    return this.props.item.executions && this.props.item.executions.length
      && this.props.item.executions[this.props.item.executions.length - 1]
  }

  getStatus() {
    let lastExecution = this.getLastExecution()
    return lastExecution && lastExecution.status
  }

  handleDetailsNavigationChange(item) {
    window.location.href = `/#/replica${(item.value && '/') || ''}${item.value}/${this.props.item.id}`
  }

  renderBottomControls() {
    return (
      <Buttons>
        <Button
          primary
          disabled={this.getStatus() !== 'COMPLETED'}
          onClick={this.props.onCreateMigrationClick}
        >Create Migration</Button>
        <Button
          alert
          hollow
          onClick={this.props.onDeleteReplicaClick}
        >Delete Replica</Button>
      </Buttons>
    )
  }

  renderMainDetails() {
    if (this.props.page !== '') {
      return null
    }

    return (
      <MainDetails
        item={this.props.item}
        endpoints={this.props.endpoints}
        bottomControls={this.renderBottomControls()}
      />
    )
  }

  renderExecutions() {
    if (this.props.page !== 'executions') {
      return null
    }

    return (
      <Executions
        item={this.props.item}
        onCancelExecutionClick={this.props.onCancelExecutionClick}
        onDeleteExecutionClick={this.props.onDeleteExecutionClick}
        onExecuteClick={this.props.onExecuteClick}
      />
    )
  }

  render() {
    return (
      <Wrapper>
        <DetailsNavigation
          items={NavigationItems}
          selectedValue={this.props.page}
          onChange={item => this.handleDetailsNavigationChange(item)}
        />
        <DetailsBody>
          {this.renderMainDetails()}
          {this.renderExecutions()}
        </DetailsBody>
      </Wrapper>
    )
  }
}

export default ReplicaDetailsContent
