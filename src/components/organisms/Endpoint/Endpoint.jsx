import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { EndpointLogos, Field, Button } from 'components'
import LabelDictionary from '../../../utils/LabelDictionary'
import NotificationActions from '../../../actions/NotificationActions'

const Wrapper = styled.div`
  padding: 48px 32px 32px 32px;
  display: flex;
  align-items: center;
  flex-direction: column;
`
const Fields = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -64px;
  margin-top: 48px;
`
const FieldStyled = styled(Field) `
  margin-left: 64px;
  min-width: 224px;
  max-width: 224px;
  margin-bottom: 16px;
`
const RadioGroup = styled.div`
  width: 100%;
`
const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 32px;
`

class Endpoint extends React.Component {
  static propTypes = {
    schema: PropTypes.array,
    endpoint: PropTypes.object,
    connectionInfo: PropTypes.object,
    onFieldChange: PropTypes.func,
    onCancelClick: PropTypes.func,
    onValidateClick: PropTypes.func,
  }

  constructor() {
    super()

    this.state = {
      fields: null,
      invalidFields: [],
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      endpoint: {
        ...props.endpoint,
        ...props.connectionInfo,
      },
    })
  }

  getFieldValue(field, parentGroup) {
    if (parentGroup) {
      return this.state.endpoint[field.name]
    }

    if (Object.keys(this.state.endpoint).find(k => k === field.name)) {
      return this.state.endpoint[field.name]
    }

    if (Object.keys(field).find(k => k === 'default')) {
      return field.default
    }

    return ''
  }

  findInvalidFields(invalidFields, schemaRoot) {
    schemaRoot.forEach(field => {
      if (field.type === 'radio-group') {
        let selectedItem = field.items.find(i => i.name === this.state.endpoint[field.name])
        this.findInvalidFields(invalidFields, selectedItem.fields)
      } else if (field.required) {
        let value = this.state.endpoint[field.name]
        if (!value) {
          invalidFields.push(field.name)
        }
      }
    })
  }

  highlightRequired() {
    let invalidFields = []
    this.findInvalidFields(invalidFields, this.props.schema)
    this.setState({ invalidFields })
    return invalidFields.length > 0
  }

  handleFieldChange(field, value, parentGroup) {
    let endpoint = { ...this.state.endpoint }

    if (parentGroup) {
      parentGroup.items.forEach(item => {
        endpoint[item.name] = false
      })
      endpoint[parentGroup.name] = field.name
    }

    endpoint[field.name] = value

    this.setState({ endpoint })
  }

  handleValidateClick() {
    if (!this.highlightRequired()) {
      this.props.onValidateClick()
    } else {
      NotificationActions.notify('Please fill all the required fields', 'error')
    }
  }

  renderFields(fields, parentGroup) {
    if (!this.state.endpoint) {
      return null
    }

    let renderedFields = []

    fields.forEach(field => {
      if (field.type === 'radio-group') {
        renderedFields = renderedFields.concat(
          <RadioGroup key={field.name}>{this.renderFields(field.items, field)}</RadioGroup>
        )

        field.items.forEach(item => {
          if (item.name === this.state.endpoint[field.name]) {
            renderedFields = renderedFields.concat(this.renderFields(item.fields))
          }
        })

        return
      }

      renderedFields = renderedFields.concat(
        <FieldStyled
          {...field}
          large
          key={field.name}
          password={field.name === 'password'}
          type={field.type}
          highlight={this.state.invalidFields.findIndex(fn => fn === field.name) > -1}
          label={LabelDictionary.get(field.name)}
          value={this.getFieldValue(field, parentGroup)}
          onChange={value => { this.handleFieldChange(field, value, parentGroup) }}
        />
      )
    })

    return renderedFields
  }

  render() {
    return (
      <Wrapper>
        <EndpointLogos large endpoint={this.props.endpoint.type} />
        <Fields>
          {this.renderFields(this.props.schema)}
        </Fields>
        <Buttons>
          <Button secondary onClick={this.props.onCancelClick}>Cancel</Button>
          <Button onClick={() => this.handleValidateClick()}>Validate and save</Button>
        </Buttons>
      </Wrapper>
    )
  }
}

export default Endpoint
