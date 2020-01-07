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

// @flow

import * as React from 'react'
import styled from 'styled-components'

import configLoader from '../../../utils/Config'

import ToggleButtonBar from '../../../components/atoms/ToggleButtonBar'
import type { Field } from '../../../types/Field'
import { Wrapper, FieldStyled, Row } from '../default/ContentPlugin'

import StyleProps from '../../../components/styleUtils/StyleProps'
import Palette from '../../../components/styleUtils/Palette'

const ToggleButtonBarStyled = styled(ToggleButtonBar)`
  margin-top: 16px;
`
const Fields = styled.div`
  margin-top: 32px;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  overflow: auto;
`
const Group = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`
const GroupName = styled.div`
  display: flex;
  align-items: center;
  margin: 32px 0 24px 0;
`
const GroupNameText = styled.div`
  margin: 0 32px;
  font-size: 16px;
`
const GroupNameBar = styled.div`
  flex-grow: 1;
  background: ${Palette.grayscale[3]};
  height: 1px;
`
const GroupFields = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`

type Props = {
  connectionInfoSchema: Field[],
  validation: { valid: boolean, validation: { message: string } },
  invalidFields: string[],
  getFieldValue: (field: ?Field) => any,
  handleFieldChange: (field: ?Field, value: any) => void,
  handleFieldsChange: (items: { field: Field, value: any }[]) => void,
  disabled: boolean,
  cancelButtonText: string,
  validating: boolean,
  onRef: (contentPlugin: any) => void,
  onResizeUpdate: (scrollOfset: number) => void,
  scrollableRef: (ref: HTMLElement) => void,
}
type State = {
  useAdvancedOptions: boolean,
  showCephOptions: boolean,
}
class ContentPlugin extends React.Component<Props, State> {
  // This is a temporary hack, should be always true for all plugins, but momentaraly causes issues in Azure plugins
  // Fix Azure plugin and remove this line
  static REQUIRES_PARENT_OBJECT_PATH = true

  state = {
    useAdvancedOptions: false,
    showCephOptions: false,
  }

  previouslySelectedChoices: string[] = []

  get useCurrentUser(): boolean {
    return Boolean(this.getFieldValue(this.props.connectionInfoSchema.find(n => n.name === 'openstack_use_current_user')))
  }

  get hasCephOptionsSet(): boolean {
    let cephOptionsField = this.props.connectionInfoSchema.find(n => n.name === 'ceph_options')
    if (!cephOptionsField || !cephOptionsField.properties) {
      return false
    }
    let hasValues = cephOptionsField.properties.filter(f => this.getFieldValue(f))
    return hasValues.length > 0
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.useAdvancedOptions !== this.state.useAdvancedOptions) {
      this.props.onResizeUpdate(0)
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  getApiVersion(): number {
    return this.props.getFieldValue(this.props.connectionInfoSchema.find(n => n.name === 'identity_api_version'))
  }

  getFieldValue(field: ?Field) {
    let fieldValue = this.props.getFieldValue(field)
    if (fieldValue) {
      return fieldValue
    }

    let getInputChoiceValue = (fieldBaseName: string): string => {
      let id = this.props.getFieldValue(this.props.connectionInfoSchema.find(n => n.name === `${fieldBaseName}_id`))
      let previouslySelected = this.previouslySelectedChoices.find(f => f === `${fieldBaseName}_id`)
      if (id || previouslySelected) {
        if (!previouslySelected) this.previouslySelectedChoices.push(`${fieldBaseName}_id`)
        return `${fieldBaseName}_id`
      }
      return `${fieldBaseName}_name`
    }
    if (field && field.name === 'user_domain') {
      return getInputChoiceValue('user_domain')
    }
    if (field && field.name === 'project_domain') {
      return getInputChoiceValue('project_domain')
    }

    return fieldValue
  }

  handleAdvancedOptionsToggle(useAdvancedOptions: boolean) {
    this.setState({ useAdvancedOptions })
  }

  handleShowCepthOptionsChange(value: boolean) {
    let cephOptions = this.props.connectionInfoSchema.find(f => f.name === 'ceph_options')
    if (!cephOptions || !cephOptions.properties) {
      return
    }
    let resetFields = cephOptions.properties.map(field => ({
      field,
      value: null,
    }))

    this.props.handleFieldsChange(resetFields)

    this.setState({ showCephOptions: value })
  }

  findInvalidFields = () => {
    let inputChoices = ['user_domain', 'project_domain']

    let invalidFields = this.props.connectionInfoSchema.filter(field => {
      if (this.isFieldRequired(field)) {
        let value = this.getFieldValue(field)
        return !value
      }
      let inputChoice = inputChoices.find(c => c === field.name)
      if (inputChoice && this.getApiVersion() > 2) {
        let selectionValue = this.getFieldValue(this.props.connectionInfoSchema.find(f => f.name === inputChoice))
        let itemValue = this.getFieldValue(this.props.connectionInfoSchema.find(f => f.name === selectionValue))
        return !itemValue
      }

      return false
    }).map(f => f.name)

    let cephOptions = this.props.connectionInfoSchema.find(f => f.name === 'ceph_options')
    let cephOptionsProperties = cephOptions && cephOptions.properties
    if (cephOptionsProperties && (this.state.showCephOptions || this.hasCephOptionsSet)) {
      invalidFields = invalidFields.concat(
        cephOptionsProperties.filter(f => f.required && !this.getFieldValue(f)).map(f => f.name)
      )
    }
    return invalidFields
  }

  filterSimpleAdvanced(): Field[] {
    let extraAdvancedFields = ['description', 'glance_api_version', 'identity_api_version', 'openstack_use_current_user']
    if (this.getApiVersion() > 2) {
      extraAdvancedFields = extraAdvancedFields.concat(['user_domain', 'project_domain'])
    }
    let ignoreFields = ['user_domain_id', 'project_domain_id', 'user_domain_name', 'project_domain_name']
    if (!configLoader.config.showOpenstackCurrentUserSwitch) {
      ignoreFields.push('openstack_use_current_user')
    }

    return this.props.connectionInfoSchema.filter(f => !ignoreFields.find(i => i === f.name)).filter(field => {
      if (field.name === 'ceph_options') {
        return this.state.useAdvancedOptions && (this.state.showCephOptions || this.hasCephOptionsSet)
      }

      if (this.state.useAdvancedOptions) {
        return true
      }
      return field.required || extraAdvancedFields.find(fieldName => field.name === fieldName)
    })
  }

  isFieldRequired(field: Field) {
    return this.useCurrentUser ? field.name === 'name' : field.required
  }

  renderSimpleAdvancedToggle() {
    return (
      <ToggleButtonBarStyled
        items={[{ label: 'Simple', value: 'simple' }, { label: 'Advanced', value: 'advanced' }]}
        selectedValue={this.state.useAdvancedOptions ? 'advanced' : 'simple'}
        onChange={item => { this.handleAdvancedOptionsToggle(item.value === 'advanced') }}
      />
    )
  }

  renderFields() {
    const rows = []
    let fields = this.filterSimpleAdvanced()
    if (this.state.useAdvancedOptions) {
      let showCepthOptionsField = {
        name: 'show_ceph_options',
        label: 'Use Ceph for Replication',
        type: 'boolean',
        description: 'If performing Ceph-based Replicas from a source OpenStack, the Ceph configuration file and credentials for a user with read-only access to the Ceph pool used by Cinder backups/snapshots must be provided. Coriolis must be able to connect to the source OpenStack\'s Ceph RADOS cluster by being able to reach at least one Ceph- monitor host.For the easiest setup possible, simply using the same credentials used by the Cinder service(s) will work.',
      }
      fields.push(showCepthOptionsField)
    }

    const renderField = field => {
      let disabled = this.props.disabled
        || (this.useCurrentUser && field.name !== 'name' && field.name !== 'description' && field.name !== 'openstack_use_current_user')
      let required = this.isFieldRequired(field)
        || (this.getApiVersion() > 2 ? field.name === 'user_domain' || field.name === 'project_domain' : false)
      let isPassword = Boolean(configLoader.config.passwordFields.find(fn => field.name === fn))
        || field.name.indexOf('password') > -1
      let value = field.name === 'show_ceph_options' ? (this.state.showCephOptions || this.hasCephOptionsSet) : this.getFieldValue(field)
      let onChange = value => {
        if (field.name === 'show_ceph_options') {
          this.handleShowCepthOptionsChange(value)
        } else {
          this.props.handleFieldChange(field, value)
        }
      }

      return (
        <FieldStyled
          {...field}
          required={required}
          password={isPassword}
          width={StyleProps.inputSizes.large.width}
          disabled={disabled}
          highlight={this.props.invalidFields.findIndex(fn => fn === field.name) > -1}
          value={value}
          onChange={onChange}
          getFieldValue={fieldName => this.getFieldValue(this.props.connectionInfoSchema.find(n => n.name === fieldName))}
          onFieldChange={(fieldName, fieldValue) => { this.props.handleFieldChange(this.props.connectionInfoSchema.find(n => n.name === fieldName), fieldValue) }}
        />
      )
    }

    let lastField = null
    let nonCephFields = fields.filter(f => f.name !== 'ceph_options')
    nonCephFields.forEach((field, i) => {
      const currentField = renderField(field)
      if (i % 2 !== 0) {
        rows.push((
          <Row key={field.name}>
            {lastField}
            {currentField}
          </Row>
        ))
      } else if (i === nonCephFields.length - 1) {
        rows.push((
          <Row key={field.name}>
            {currentField}
          </Row>
        ))
      }
      lastField = currentField
    })

    const cephOptionsRows = []
    let cephOptionsField = fields.find(f => f.name === 'ceph_options')
    let cephOptions = null
    let properties = cephOptionsField && cephOptionsField.properties

    if (properties) {
      let i = 0
      properties.forEach((field, fieldIndex) => {
        if (field.name === 'ceph_options/ceph_conf_file' || field.name === 'ceph_options/ceph_keyring_file') {
          field.useTextArea = true
        }

        const currentField = renderField(field)

        const pushRow = (field1: React.Node, field2?: React.Node) => {
          cephOptionsRows.push((
            <Row key={field.name}>
              {field1}
              {field2}
            </Row>
          ))
        }
        if (field.useTextArea) {
          pushRow(currentField)
          i -= 1
        } else if (i % 2 !== 0) {
          pushRow(lastField, currentField)
        } else if (fieldIndex === properties.length - 1) {
          pushRow(currentField)
          if (field.useTextArea) {
            i -= 1
          }
        } else {
          lastField = currentField
        }
        i += 1
      })

      cephOptions = (
        <Group>
          <GroupName>
            <GroupNameBar />
            <GroupNameText>Ceph Options</GroupNameText>
            <GroupNameBar />
          </GroupName>
          <GroupFields>{cephOptionsRows}</GroupFields>
        </Group>
      )
    }

    return (
      <Fields innerRef={ref => { this.props.scrollableRef(ref) }}>
        <Group>
          <GroupFields>
            {rows}
          </GroupFields>
        </Group>
        {cephOptions}
      </Fields>
    )
  }

  render() {
    return (
      <Wrapper>
        {this.renderSimpleAdvancedToggle()}
        {this.renderFields()}
      </Wrapper>
    )
  }
}

export default ContentPlugin
