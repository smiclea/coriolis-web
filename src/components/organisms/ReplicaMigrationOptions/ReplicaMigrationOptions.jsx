import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Button, Field } from 'components'

import LabelDictionary from '../../../utils/LabelDictionary'
import replicaMigrationImage from './images/replica-migration.svg'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 32px 32px 32px;
`
const Image = styled.div`
  width: 288px;
  height: 96px;
  background: url('${replicaMigrationImage}') center no-repeat;
  margin: 80px 0;
`
const Form = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -64px;
  width: 300px;
  margin: 0 auto 110px auto;
`
const FieldStyled = styled(Field) `
  margin-bottom: 16px;
  margin-left: 64px;
`
const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

class ReplicaMigrationOptions extends React.Component {
  static propTypes = {
    onCancelClick: PropTypes.func,
    onMigrateClick: PropTypes.func,
  }

  constructor() {
    super()

    this.state = {
      fields: [
        {
          name: 'clone_disks',
          type: 'boolean',
          value: true,
        },
        {
          name: 'force',
          type: 'boolean',
        },
        {
          name: 'skip_os_morphing',
          type: 'boolean',
        },
      ],
    }
  }

  handleValueChange(field, value) {
    this.state.fields.find(f => f.name === field.name).value = value
    this.setState({ fields: this.state.fields })
  }

  render() {
    return (
      <Wrapper>
        <Image />
        <Form>
          {this.state.fields.map(field => {
            return (
              <FieldStyled
                key={field.name}
                type={field.type}
                value={field.value}
                label={LabelDictionary.get(field.name)}
                onChange={value => this.handleValueChange(field, value)}
              />
            )
          })}
        </Form>
        <Buttons>
          <Button secondary onClick={this.props.onCancelClick}>Cancel</Button>
          <Button onClick={() => { this.props.onMigrateClick(this.state.fields) }}>Migrate</Button>
        </Buttons>
      </Wrapper>
    )
  }
}

export default ReplicaMigrationOptions
