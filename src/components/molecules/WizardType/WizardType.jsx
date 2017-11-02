import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Switch } from 'components'

import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'

import migrationImage from './images/migration.js'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 96px;
`
const Image = styled.div`
  width: 96px;
  height: 96px;
  background: url('data:image/svg+xml;utf8,${props => props.type === 'replica' ? migrationImage(Palette.alert) : migrationImage(Palette.primary)}') center no-repeat;
`
const Row = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 52px;
`
const Column = styled.div`
  width: ${props => props.middle ? 192 : 304}px;
  text-align: ${props => props.left ? 'right' : 'left'};
  display: flex;
  flex-direction: column;
  ${props => props.middle ? 'align-items: center;' : ''}
`
const Title = styled.div`
  font-size: 23px;
  font-weight: ${StyleProps.fontWeights.light};
  margin-bottom: 17px;
`
const Message = styled.div`
  color: ${Palette.grayscale[4]};
  transition: all ${StyleProps.animations.swift};
  opacity: ${props => props.selected ? 1 : 0.6};
`

class WizardType extends React.Component {
  static propTypes = {
    selected: PropTypes.string,
    onChange: PropTypes.func,
  }

  render() {
    return (
      <Wrapper>
        <Image type={this.props.selected} />
        <Row>
          <Column left>
            <Title>Coriolis Migration</Title>
            <Message selected={this.props.selected === 'migration'}>A Coriolis Migration is a one time move one ore more virtual machine. Whatever Blue Bottle Neutra irony 8-bit. Kogi ethnic ugh fashion axe bicycle rights. Gluten-free Odd Future American</Message>
          </Column>
          <Column middle>
            <Switch big onChange={this.props.onChange} checked={this.props.selected === 'replica'} />
          </Column>
          <Column>
            <Title>Coriolis Replica</Title>
            <Message selected={this.props.selected === 'replica'}>The Coriolis Replica is obtained by copying (replicating) incrementally the virtual machines data from the source environment to the target, without interfering with any running workload. A migration replica can then be finalized by automatically applying the required changes to adapt it to the target environment (migration phase).</Message>
          </Column>
        </Row>
      </Wrapper>
    )
  }
}

export default WizardType
