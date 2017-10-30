import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Button } from 'components'

import StyleProps from '../../styleUtils/StyleProps'

import loadingImage from './images/loading.svg'

const ButtonStyled = styled(Button)`
  position: relative
`
const Loading = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  background: url('${loadingImage}') center no-repeat;
  ${StyleProps.animations.rotation}
`

class LoadingButton extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <ButtonStyled {...this.props} disabled>
        <span>{this.props.children}<Loading /></span>
      </ButtonStyled>
    )
  }
}

export default LoadingButton
