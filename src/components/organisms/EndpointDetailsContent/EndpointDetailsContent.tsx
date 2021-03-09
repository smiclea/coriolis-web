/*
Copyright (C) 2017  Cloudbase Solutions SRL
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import * as React from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import EndpointLogos from '../../atoms/EndpointLogos'
import PasswordValue from '../../atoms/PasswordValue'
import Button from '../../atoms/Button'
import CopyValue from '../../atoms/CopyValue'
import CopyMultilineValue from '../../atoms/CopyMultilineValue'
import StatusImage from '../../atoms/StatusImage'

import type { Endpoint } from '../../../@types/Endpoint'
import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'
import DateUtils from '../../../utils/DateUtils'
import LabelDictionary from '../../../utils/LabelDictionary'
import configLoader from '../../../utils/Config'
import { Region } from '../../../@types/Region'
import { MigrationItem, ReplicaItem, TransferItem } from '../../../@types/MainItem'
import { Field as FieldType } from '../../../@types/Field'
import DomUtils from '../../../utils/DomUtils'

const Wrapper = styled.div<any>`
  ${StyleProps.exactWidth(StyleProps.contentWidth)}
  margin: 0 auto;
  padding-left: 126px;
`
const Info = styled.div<any>`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  margin-left: -32px;
`
const Field = styled.div<any>`
  ${StyleProps.exactWidth('calc(50% - 32px)')}
  margin-bottom: 32px;
  margin-left: 32px;
`
const Label = styled.div<any>`
  font-size: 10px;
  font-weight: ${StyleProps.fontWeights.medium};
  color: ${Palette.grayscale[3]};
  text-transform: uppercase;
  margin-bottom: 3px;
`
const Value = styled.div<any>``
const Buttons = styled.div<any>`
  display: flex;
  justify-content: space-between;
  margin-top: 64px;
`
const MainButtons = styled.div<any>``
const DeleteButton = styled.div<any>``
const LoadingWrapper = styled.div<any>`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 32px 0 64px 0;
`
const LinkStyled = styled(Link)`
  color: ${Palette.primary};
  text-decoration: none;
  cursor: pointer;
`

const DownloadLink = styled.div`
  display: inline-block;
  color: ${Palette.primary};
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`

type Props = {
  item: Endpoint | null,
  regions: Region[],
  connectionInfo: Endpoint['connection_info'] | null,
  loading: boolean,
  usage: { migrations: MigrationItem[], replicas: ReplicaItem[] },
  connectionInfoSchema: FieldType[],
  onDeleteClick: () => void,
  onValidateClick: () => void,
}
@observer
class EndpointDetailsContent extends React.Component<Props> {
  renderedKeys!: { [prop: string]: boolean }

  renderDownloadValue(value: string, fieldName: string) {
    const endpoint = this.props.item
    if (!endpoint) {
      return null
    }
    return (
      <DownloadLink onClick={() => {
        DomUtils.download(value, fieldName)
      }}
      >Download
      </DownloadLink>
    )
  }

  renderConnectionInfoLoading() {
    if (!this.props.loading) {
      return null
    }

    return (
      <LoadingWrapper>
        <StatusImage loading />
      </LoadingWrapper>
    )
  }

  renderConnectionInfo(connectionInfo: any): React.ReactNode {
    if (!connectionInfo) {
      return null
    }

    return Object.keys(connectionInfo).map(key => {
      let value = connectionInfo[key]

      if (key === 'secret_ref') {
        return null
      }

      if (typeof connectionInfo[key] === 'object') {
        return this.renderConnectionInfo(connectionInfo[key])
      }

      if (this.renderedKeys[key]) {
        return null
      }

      this.renderedKeys[key] = true

      if (value === true) {
        value = 'Yes'
      } else if (value === false) {
        value = 'No'
      } else if (!value) {
        value = '-'
      }

      let valueElement = null
      const schemaField = this.props.connectionInfoSchema.find(f => f.name === key)

      if (configLoader.config.passwordFields.find(fn => fn === key) || key.indexOf('password') > -1) {
        valueElement = <PasswordValue value={value} />
      } else if (schemaField?.useFile) {
        valueElement = this.renderDownloadValue(value, key)
      } else {
        valueElement = this.renderValue(value)
      }

      return (
        <Field key={key}>
          <Label>{LabelDictionary.get(key)}</Label>
          {valueElement}
        </Field>
      )
    })
  }

  renderButtons() {
    return (
      <Buttons>
        <MainButtons>
          <Button onClick={this.props.onValidateClick}>Validate Endpoint</Button>
        </MainButtons>
        <DeleteButton>
          <Button hollow alert onClick={this.props.onDeleteClick}>Delete Endpoint</Button>
        </DeleteButton>
      </Buttons>
    )
  }

  renderValue(value: string) {
    return <CopyValue value={value} maxWidth="90%" />
  }

  renderRegions() {
    return (
      <span>
        {this.props.item?.mapped_regions
          .map(regionId => this.props.regions.find(r => r.id === regionId)?.name).join(', ') || '-'}
      </span>
    )
  }

  renderUsage(items: TransferItem[]) {
    return items.map(item => (
      <span>
        <LinkStyled
          key={item.id}
          to={`/${item.type}s/${item.id}`}
        >
          {item.instances[0]}
        </LinkStyled>
        <br />
      </span>
    ))
  }

  render() {
    this.renderedKeys = {}
    const {
      type, name, description, created_at, id,
    } = this.props.item || {}
    const usage: TransferItem[] = this.props.usage.replicas
      .concat(this.props.usage.migrations as any[])

    return (
      <Wrapper>
        <EndpointLogos endpoint={type} />
        <Info>
          <Field>
            <Label>Id</Label>
            {this.renderValue(id || '')}
          </Field>
          <Field>
            <Label>Name</Label>
            {this.renderValue(name || '')}
          </Field>
          <Field>
            <Label>Type</Label>
            {this.renderValue(type || '')}
          </Field>
          <Field>
            <Label>Coriolis Regions</Label>
            {this.renderRegions()}
          </Field>
          <Field>
            <Label>Description</Label>
            {description ? <CopyMultilineValue value={description} /> : <Value>-</Value>}
          </Field>
          <Field>
            <Label>Created</Label>
            {this.renderValue(DateUtils.getLocalTime(created_at).format('DD/MM/YYYY HH:mm'))}
          </Field>
          <Field>
            <Label>Used in replicas/migrations ({usage.length})</Label>
            {usage.length > 0 ? this.renderUsage(usage) : <Value>-</Value>}
          </Field>
          {!this.props.connectionInfo ? this.renderConnectionInfoLoading() : null}
          {this.renderConnectionInfo(this.props.connectionInfo)}
        </Info>
        {this.renderButtons()}
      </Wrapper>
    )
  }
}

export default EndpointDetailsContent
