import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import connectToStores from 'alt-utils/lib/connectToStores'

import { EndpointLogos, Field, Button, StatusIcon, LoadingButton } from 'components'
import LabelDictionary from '../../../utils/LabelDictionary'
import NotificationActions from '../../../actions/NotificationActions'

import EndpointStore from '../../../stores/EndpointStore'
import EndpointActions from '../../../actions/EndpointActions'
import ProviderStore from '../../../stores/ProviderStore'
import ProviderActions from '../../../actions/ProviderActions'

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
  margin-top: 32px;
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
const Status = styled.div`
  display: flex;
`
const StatusMessage = styled.div`
  margin-left: 8px;
`

class Endpoint extends React.Component {
  static propTypes = {
    schema: PropTypes.array,
    endpoint: PropTypes.object,
    connectionInfo: PropTypes.object,
    onFieldChange: PropTypes.func,
    onCancelClick: PropTypes.func,
    onResizeUpdate: PropTypes.func,
    onValidateClick: PropTypes.func,
    endpointStore: PropTypes.object,
    providerStore: PropTypes.object,
  }

  static getStores() {
    return [EndpointStore, ProviderStore]
  }

  static getPropsFromStores() {
    return {
      endpointStore: EndpointStore.getState(),
      providerStore: ProviderStore.getState(),
    }
  }

  constructor() {
    super()

    this.state = {
      fields: null,
      invalidFields: [],
    }
  }

  componentDidMount() {
    ProviderActions.getConnectionInfoSchema(this.props.endpoint.type)
  }

  componentWillReceiveProps(props) {
    let loginType = this.getLoginType(props.endpointStore.connectionInfo,
      props.providerStore.connectionInfoSchema)

    this.setState({
      endpoint: {
        ...props.endpoint,
        ...loginType,
        ...props.endpointStore.connectionInfo,
      },
    })

    this.props.onResizeUpdate()
  }

  componentWillUnmount() {
    EndpointActions.clearValidation()
    clearTimeout(this.closeTimeout)
  }

  getLoginType(connectionInfo, schema) {
    let radioGroup = schema.find(f => f.type === 'radio-group')

    if (!radioGroup) {
      return null
    }

    let selectedGroupItem = {}
    radioGroup.items.forEach(i => {
      let key = Object.keys(connectionInfo).find(k => k === i.name)
      if (key) {
        selectedGroupItem[radioGroup.name] = key
      }
    })

    return selectedGroupItem
  }

  getFieldValue(field, parentGroup) {
    if (parentGroup) {
      return this.state.endpoint[parentGroup.name] === field.name
    }

    let value = null
    let findValueInState = state => {
      Object.keys(state).forEach(k => {
        if (k === field.name) {
          value = state[k]
        }

        if (state[k] && typeof state[k] === 'object') {
          findValueInState(state[k])
        }
      })
    }

    findValueInState(this.state.endpoint)
    if (value) {
      return value
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
    this.findInvalidFields(invalidFields, this.props.providerStore.connectionInfoSchema)
    this.setState({ invalidFields })
    return invalidFields.length > 0
  }

  handleFieldChange(field, value, parentGroup) {
    let endpoint = { ...this.state.endpoint }

    if (parentGroup) {
      endpoint[parentGroup.name] = field.name
    } else {
      endpoint[field.name] = value
    }

    this.setState({ endpoint })
  }

  handleValidateClick() {
    if (!this.highlightRequired()) {
      EndpointActions.update(this.state.endpoint)
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
          if (this.getFieldValue(item, field)) {
            renderedFields = renderedFields.concat(this.renderFields(item.fields))
          }
        })

        return
      }

      renderedFields = renderedFields.concat(
        <FieldStyled
          {...field}
          large
          disabled={this.props.endpointStore.validationLoading
            || (this.props.endpointStore.validation && this.props.endpointStore.validation.valid)}
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

  renderEndpointStatus() {
    let validation = this.props.endpointStore.validation
    if (!this.props.endpointStore.validationLoading && (!validation || !validation.valid)) {
      return null
    }

    let status = 'RUNNING'
    let message = 'Validating Endpoint ...'

    if (validation && validation.valid) {
      message = 'Endpoint is Valid'
      status = 'COMPLETED'
    }

    return (
      <Status>
        <StatusIcon status={status} />
        <StatusMessage>{message}</StatusMessage>
      </Status>
    )
  }

  renderActionButton() {
    let button = <Button large onClick={() => this.handleValidateClick()}>Validate and save</Button>

    let message = 'Validating Endpoint ...'
    let validation = this.props.endpointStore.validation

    if (this.props.endpointStore.validationLoading || (validation && validation.valid)) {
      if (validation && validation.valid) {
        message = 'Saving ...'
      }

      button = <LoadingButton large>{message}</LoadingButton>
    }

    return button
  }

  render() {
    if (this.props.endpointStore.validation && this.props.endpointStore.validation.valid
      && !this.closeTimeout) {
      this.closeTimeout = setTimeout(() => {
        this.props.onCancelClick()
      }, 2000)
    }

    return (
      <Wrapper>
        <EndpointLogos style={{ marginBottom: '16px' }} large endpoint={this.props.endpoint.type} />
        {this.renderEndpointStatus()}
        <Fields>
          {this.renderFields(this.props.providerStore.connectionInfoSchema)}
        </Fields>
        <Buttons>
          <Button large secondary onClick={this.props.onCancelClick}>Cancel</Button>
          {this.renderActionButton()}
        </Buttons>
      </Wrapper>
    )
  }
}

export default connectToStores(Endpoint)
