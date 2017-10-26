import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { EndpointLogos, Field } from 'components'
import LabelDictionary from '../../../utils/LabelDictionary'

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
`
const FieldStyled = styled(Field) `
  margin-left: 64px;
  min-width: 224px;
  max-width: 224px;
  margin-bottom: 16px;
`

class Endpoint extends React.Component {
  static propTypes = {
    schema: PropTypes.array,
    endpoint: PropTypes.object,
    connectionInfo: PropTypes.object,
  }

  getFieldValue(field) {
    if (Object.keys(this.props.endpoint).find(k => k === field.name)) {
      return this.props.endpoint[field.name]
    }

    if (Object.keys(this.props.connectionInfo).find(k => k === field.name)) {
      return this.props.connectionInfo[field.name]
    }

    if (Object.keys(field).find(k => k === 'default')) {
      return field.default
    }

    return ''
  }

  renderFields() {
    return (
      <Fields>
        {this.props.schema.map(field => {
          return (
            <FieldStyled
              {...field}
              large
              key={field.name}
              password={field.name === 'password'}
              type={field.type}
              label={LabelDictionary.get(field.name)}
              value={this.getFieldValue(field)}
            />
          )
        })}
      </Fields>
    )
  }

  render() {
    return (
      <Wrapper>
        <EndpointLogos large endpoint={this.props.endpoint.type} />
        {this.renderFields()}
      </Wrapper>
    )
  }
}

export default Endpoint
