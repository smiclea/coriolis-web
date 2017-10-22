import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { CopyButton } from 'components'
import NotificationActions from '../../../actions/NotificationActions'
import DomUtils from '../../../utils/DomUtils'

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  &:hover > span:last-child {
    opacity: 1;
  }
`
const Value = styled.span`
  width: ${props => props.autoWidth ? 'auto' : `${props.width}px`};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  margin-right: 4px;
`

class IdValue extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    width: PropTypes.number,
    autoWidth: PropTypes.bool,
  }

  static defaultProps = {
    width: 192,
  }

  handleCopyIdClick(e) {
    e.stopPropagation()

    let succesful = DomUtils.copyTextToClipboard(this.props.value)

    if (succesful) {
      NotificationActions.notify('The ID has been copied to clipboard.')
    } else {
      NotificationActions.notify('The ID couldn\'t be copied', 'error')
    }
  }

  render() {
    return (
      <Wrapper
        onClick={e => { this.handleCopyIdClick(e) }}
        onMouseDown={e => { e.stopPropagation() }}
        onMouseUp={e => { e.stopPropagation() }}
      >
        <Value width={this.props.width} autoWidth={this.props.autoWidth}>{this.props.value}</Value><CopyButton />
      </Wrapper>
    )
  }
}

export default IdValue
