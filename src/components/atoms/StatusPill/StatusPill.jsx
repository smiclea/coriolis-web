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
}

const Wrapper = styled.div`
  width: 94px;
  height: 14px;
  line-height: 14px;
  border: 1px solid;
  font-size: 9px;
  font-weight: ${StyleProps.fontWeights.medium};
  text-align: center;
  border-radius: 4px;
  ${props => statuses[props.status]}
`

class StatusPill extends React.Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
  }

  render() {
    return (
      <Wrapper status={this.props.status}>
        {this.props.status}
      </Wrapper>
    )
  }
}

export default StatusPill
