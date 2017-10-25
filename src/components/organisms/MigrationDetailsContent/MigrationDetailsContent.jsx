import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { DetailsNavigation, MainDetails, Button, Tasks } from 'components'

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
    label: 'Migration',
    value: '',
  }, {
    label: 'Tasks',
    value: 'tasks',
  },
]

class MigrationDetailsContent extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    endpoints: PropTypes.array,
    page: PropTypes.string,
    onDeleteMigrationClick: PropTypes.func,
  }

  handleDetailsNavigationChange(item) {
    window.location.href = `/#/migration${(item.value && '/') || ''}${item.value}/${this.props.item.id}`
  }

  renderBottomControls() {
    return (
      <Buttons>
        <Button
          alert
          hollow
          onClick={this.props.onDeleteMigrationClick}
        >Delete Migration</Button>
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

  renderTasks() {
    if (this.props.page !== 'tasks' || !this.props.item.tasks) {
      return null
    }

    return (
      <Tasks
        items={this.props.item.tasks}
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
          {this.renderTasks()}
        </DetailsBody>
      </Wrapper>
    )
  }
}

export default MigrationDetailsContent
