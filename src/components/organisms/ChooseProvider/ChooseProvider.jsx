import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { EndpointLogos, Button } from 'components'

import StyleProps from '../../styleUtils/StyleProps'

const Wrapper = styled.div`
  padding: 22px 0 32px 0;
  text-align: center;
`
const Logos = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 42px;
`
const EndpointLogosStyled = styled(EndpointLogos) `
  transform: scale(0.67);
  transition: all ${StyleProps.animations.swift};
  cursor: pointer;
  &:hover {
    transform: scale(0.7);
  }
`

class ChooseProvider extends React.Component {
  static propTypes = {
    providers: PropTypes.object,
    onCancelClick: PropTypes.func,
    onProviderClick: PropTypes.func,
  }

  render() {
    if (!this.props.providers) {
      return null
    }

    return (
      <Wrapper>
        <Logos>
          {Object.keys(this.props.providers).map(k => {
            return (
              <EndpointLogosStyled
                height={128}
                key={k}
                endpoint={k}
                onClick={() => { this.props.onProviderClick(k) }}
              />
            )
          })}
        </Logos>
        <Button secondary onClick={this.props.onCancelClick}>Cancel</Button>
      </Wrapper>
    )
  }
}

export default ChooseProvider
