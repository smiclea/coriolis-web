import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { EndpointLogos, CopyButton } from 'components'

import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'

const Wrapper = styled.div`
  display: flex;
`
const Column = styled.div`
  width: ${props => props.small ? '160px' : '320px'};
`
const Row = styled.div`
  margin-bottom: 16px;
`
const Field = styled.div`
  display: flex;
  flex-direction: column;
`
const Label = styled.div`
  font-size: 10px;
  color: ${Palette.grayscale[3]};
  font-weight: ${StyleProps.fontWeights.medium};
  text-transform: uppercase;
`
const Value = styled.div`
  margin-top: 3px;
  ${props => props.link ? `color: ${Palette.primary};` : ''}
  ${props => props.link ? 'display: inline-table;' : ''}
  ${props => props.link ? 'cursor: pointer;' : ''}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

class MainDetails extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    endpoints: PropTypes.array,
  }

  getSourceEndpoint() {
    let endpoint = this.props.endpoints.find(e => e.id === this.props.item.origin_endpoint_id)
    return endpoint || {}
  }

  render() {
    return (
      <Wrapper>
        <Column>
          <Row>
            <Field>
              <Label>Source</Label>
              <Value link>{this.getSourceEndpoint().name}</Value>
            </Field>
          </Row>
          <Row>
            <EndpointLogos endpoint={this.getSourceEndpoint().type} />
          </Row>
          <Row>
            <Field>
              <Label>Id</Label>
              <Value
                width="192"
                onClick={() => this.handleCopyIdClick()}
                onMouseDown={e => e.stopPropagation()}
                onMouseUp={e => e.stopPropagation()}
              >
                {this.props.item.id}<CopyButton />
              </Value>
            </Field>
          </Row>
        </Column>
        <Column small>Col2</Column>
        <Column>Col3</Column>
      </Wrapper>
    )
  }
}

export default MainDetails
