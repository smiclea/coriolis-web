import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'
import runningImage from './images/running.svg'

const statuses = {
  COMPLETED: css`
    background: ${Palette.success};
    color: white;
    border-color: transparent;
  `,
  ERROR: css`
    background: ${Palette.alert};
    color: white;
    border-color: transparent;
  `,
  CANCELED: css`
    background: ${Palette.warning};
    color: ${Palette.black};
    border-color: transparent;
  `,
  PAUSED: css`
    background: white;
    color: ${Palette.primary};
    border-color: ${Palette.primary};
  `,
  RUNNING: css`
    background: url('${runningImage}');
    animation: bgMotion 1s infinite linear;
    color: white;
    border-color: transparent;
    @keyframes bgMotion {
      0% { background-position: -12px -1px; }
      100% { background-position: 0 -1px; }
    }
  `,
  INFO: css`
    background: white;
  `,
}

const primaryColors = css`
  color: ${Palette.primary};
  border-color: ${Palette.primary};
`
const alertColors = css`
  color: ${Palette.alert};
  border-color: ${Palette.alert};
`
const getStatusColor = props => {
  if (props.alert) {
    return alertColors
  }

  return primaryColors
}
const Wrapper = styled.div`
  width: ${props => props.small ? 78 : 94}px;
  height: 14px;
  line-height: 14px;
  border: 1px solid;
  font-size: 9px;
  font-weight: ${StyleProps.fontWeights.medium};
  text-align: center;
  border-radius: 4px;
  ${props => statuses[props.status]}
  ${props => props.status === 'INFO' ? getStatusColor(props) : ''}
`

class StatusPill extends React.Component {
  static propTypes = {
    status: PropTypes.string,
    label: PropTypes.string,
    primary: PropTypes.bool,
    alert: PropTypes.bool,
    small: PropTypes.bool,
  }

  static defaultProps = {
    status: 'INFO',
  }

  render() {
    return (
      <Wrapper
        {...this.props}
        status={this.props.status}
        primary={this.props.primary}
        alert={this.props.alert}
        small={this.props.small}
      >
        {this.props.label || this.props.status}
      </Wrapper>
    )
  }
}

export default StatusPill
