import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { StatusPill, Button } from 'components'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

import backArrowImage from './images/back-arrow.svg'

const Wrapper = styled.div`
  background: ${Palette.grayscale[0]};
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const BackButton = styled.div`
  width: 33px;
  height: 33px;
  background: url('${backArrowImage}') no-repeat center;
  cursor: pointer;
  margin-right: 32px;
`
const TypeImage = styled.div`
  min-width: 64px;
  height: 64px;
  background: url('${props => props.image}') no-repeat center;
  margin-right: 64px;
`
const Title = styled.div`
  width: 592px;
`
const Text = styled.div`
  font-size: 30px;
  font-weight: ${StyleProps.fontWeights.light};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const StatusPills = styled.div`
  display: flex;
  margin-top: 5px;
  & > div {
    margin-right: 16px;
  }
`

class DetailsContentHeader extends React.Component {
  static propTypes = {
    onBackButonClick: PropTypes.func,
    onActionButtonClick: PropTypes.func,
    typeImage: PropTypes.string,
    buttonLabel: PropTypes.string,
    item: PropTypes.object,
    alertInfoPill: PropTypes.bool,
    primaryInfoPill: PropTypes.bool,
    alertButton: PropTypes.bool,
    hollowButton: PropTypes.bool,
  }

  getLastExecution() {
    if (this.props.item.executions && this.props.item.executions.length) {
      return this.props.item.executions[this.props.item.executions.length - 1]
    } else if (typeof this.props.item.executions === 'undefined') {
      return this.props.item
    }

    return {}
  }

  getStatus() {
    let lastExecution = this.getLastExecution()
    if (lastExecution) {
      return lastExecution.status
    }

    return null
  }

  render() {
    let title = this.props.item.instances && this.props.item.instances[0]

    return (
      <Wrapper>
        <BackButton onClick={this.props.onBackButonClick} />
        <TypeImage image={this.props.typeImage} />
        <Title>
          <Text>{title}</Text>
          <StatusPills>
            <StatusPill
              status="INFO"
              label={this.props.item.type && this.props.item.type.toUpperCase()}
              alert={this.props.alertInfoPill}
              primary={this.props.primaryInfoPill}
            />
            {this.getStatus() ? <StatusPill status={this.getStatus()} /> : null}
          </StatusPills>
        </Title>
        <Button
          secondary={!this.props.alertButton}
          alert={this.props.alertButton}
          hollow={this.props.hollowButton}
          onClick={this.props.onActionButtonClick}
        >{this.props.buttonLabel}</Button>
      </Wrapper>
    )
  }
}

export default DetailsContentHeader
