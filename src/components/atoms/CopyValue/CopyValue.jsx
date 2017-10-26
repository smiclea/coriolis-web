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
  width: ${props => `${props.width || 'auto'}`};
  ${props => props.maxWidth ? `max-width: ${props.maxWidth};` : ''}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  margin-right: 4px;
`

class CopyValue extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    width: PropTypes.string,
    maxWidth: PropTypes.string,
  }

  handleCopyIdClick(e) {
    e.stopPropagation()

    let succesful = DomUtils.copyTextToClipboard(this.props.value)

    if (succesful) {
      NotificationActions.notify('The value has been copied to clipboard.')
    } else {
      NotificationActions.notify('The value couldn\'t be copied', 'error')
    }
  }

  render() {
    return (
      <Wrapper
        onClick={e => { this.handleCopyIdClick(e) }}
        onMouseDown={e => { e.stopPropagation() }}
        onMouseUp={e => { e.stopPropagation() }}
      >
        <Value
          width={this.props.width}
          maxWidth={this.props.maxWidth}
        >{this.props.value}</Value>
        <CopyButton />
      </Wrapper>
    )
  }
}

export default CopyValue
