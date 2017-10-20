import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'

import StyleProps from '../../styleUtils/StyleProps'

import errorImage from './images/error.svg'
import progressImage from './images/progress.svg'
import successImage from './images/success.svg'

const statuses = {
  COMPLETED: css`
    background-image: url('${successImage}');
  `,
  RUNNING: css`
    background-image: url('${progressImage}');
    ${StyleProps.animations.rotation}
  `,
  ERROR: css`
    background-image: url('${errorImage}');
  `,
}

const Wrapper = styled.div`
  width: 16px;
  height: 16px;
  background-repeat: no-repeat;
  background-position: center;
  ${props => statuses[props.status]}
`

class StatusIcon extends React.Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
  }

  render() {
    return (
      <Wrapper {...this.props} />
    )
  }
}

export default StatusIcon
