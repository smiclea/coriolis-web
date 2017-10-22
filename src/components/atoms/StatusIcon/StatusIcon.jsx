import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'

import StyleProps from '../../styleUtils/StyleProps'

import errorImage from './images/error.svg'
import progressWithBackgroundImage from './images/progress-background.svg'
import progressImage from './images/progress.svg'
import successImage from './images/success.svg'
import warningImage from './images/warning.svg'
import pendingImage from './images/pending.svg'

const statuses = props => {
  return {
    COMPLETED: css`
      background-image: url('${successImage}');
    `,
    RUNNING: css`
      background-image: url('${props.useBackground ? progressWithBackgroundImage : progressImage}');
      ${StyleProps.animations.rotation}
    `,
    ERROR: css`
      background-image: url('${errorImage}');
    `,
    WARNING: css`
      background-image: url('${warningImage}');
    `,
    CANCELED: css`
      background-image: url('${warningImage}');
    `,
    PENDING: css`
      background-image: url('${pendingImage}');
    `,
  }
}

const Wrapper = styled.div`
  min-width: 16px;
  max-width: 16px;
  height: 16px;
  background-repeat: no-repeat;
  background-position: center;
  ${props => statuses(props)[props.status]}
`

class StatusIcon extends React.Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    useBackground: PropTypes.bool,
  }

  render() {
    return (
      <Wrapper {...this.props} />
    )
  }
}

export default StatusIcon
