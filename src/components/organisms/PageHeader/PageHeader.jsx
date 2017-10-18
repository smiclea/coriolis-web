import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Dropdown, NewMigrationDropdown, NotificationDropdown, UserDropdown } from 'components'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const Wrapper = styled.div`
  display: flex;
  margin: 48px 64px 48px 80px;
  align-items: center;
`
const Title = styled.div`
  color: ${Palette.black};
  font-size: 32px;
  font-weight: ${StyleProps.fontWeights.light};
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const Controls = styled.div`
  display: flex;
  
  & > div {
    margin-left: 16px;
  }
`

class PageHeader extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    user: PropTypes.object,
    projects: PropTypes.array,
    onProjectChange: PropTypes.func,
    onUserItemClick: PropTypes.func,
  }

  getCurrentProject() {
    if (this.props.user && this.props.user.project) {
      return this.props.projects.find(p => p.id === this.props.user.project.id)
    }

    return null
  }

  render() {
    return (
      <Wrapper>
        <Title>{this.props.title}</Title>
        <Controls>
          <Dropdown
            selectedItem={this.getCurrentProject()}
            items={this.props.projects}
            onChange={this.props.onProjectChange}
            noItemsMessage="Loading..."
            labelField="name"
            small
          />
          <NewMigrationDropdown />
          <NotificationDropdown />
          <UserDropdown user={this.props.user} onItemClick={this.props.onUserItemClick} />
        </Controls>
      </Wrapper>
    )
  }
}

export default PageHeader
