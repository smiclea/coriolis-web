import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { CopyButton } from 'components'
import NotificationActions from '../../../actions/NotificationActions'
import Clipboard from '../../../utils/Clipboard'

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  &:hover > span:last-child {
    opacity: 1;
  }
`
const Value = styled.span`
  width: ${props => props.width}px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
`

class IdValue extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    width: PropTypes.number,
  }

  static defaultProps = {
    width: 192,
  }

  handleCopyIdClick() {
    let succesful = Clipboard.copyTextToClipboard(this.props.value)

    if (succesful) {
      NotificationActions.notify('The ID has been copied to clipboard.')
    } else {
      NotificationActions.notify('The ID couldn\'t be copied', 'error')
    }
  }

  render() {
    return (
      <Wrapper
        onClick={() => this.handleCopyIdClick()}
        onMouseDown={e => e.stopPropagation()}
        onMouseUp={e => e.stopPropagation()}
      >
        <Value width={this.props.width}>{this.props.value}</Value><CopyButton />
      </Wrapper>
    )
  }
}

export default IdValue
