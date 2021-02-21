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

import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import AutocompleteDropdown from '../../molecules/AutocompleteDropdown'
import Dropdown from '../../molecules/Dropdown'
import InfoIcon from '../../atoms/InfoIcon'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'
import { Instance, Disk, InstanceUtils } from '../../../@types/Instance'
import type { StorageBackend, StorageMap } from '../../../@types/Endpoint'

import backendImage from './images/backend.svg'
import diskImage from './images/disk.svg'
import bigStorageImage from './images/storage-big.svg'
import arrowImage from './images/arrow.svg'

const Wrapper = styled.div<any>`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
`
const Mapping = styled.div<any>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
const StorageWrapper = styled.div<any>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`
const StorageSection = styled.div<any>`
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: ${StyleProps.fontWeights.light};
`
const StorageItems = styled.div<any>`
  display: flex;
  flex-direction: column;
`
const StorageItem = styled.div<any>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  border-top: 1px solid ${Palette.grayscale[1]};
  padding: 8px 0;

  &:last-child {
    border-bottom: 1px solid ${Palette.grayscale[1]};
  }
`
const StorageImage = styled.div<any>`
  ${StyleProps.exactSize('48px')}
  background: url('${props => (props.backend ? backendImage : diskImage)}') center no-repeat;
  margin-right: 16px;
`
const StorageTitle = styled.div<any>`
  width: ${props => props.width}px;
`
const StorageName = styled.div<any>`
  font-size: 16px;
  word-break: break-word;
`
const StorageSubtitle = styled.div<any>`
  font-size: 12px;
  color: ${Palette.grayscale[5]};
  margin-top: 1px;
  word-break: break-word;
`
const ArrowImage = styled.div<any>`
  min-width: 32px;
  ${StyleProps.exactHeight('16px')}
  background: url('${arrowImage}') center no-repeat;
  flex-grow: 1;
  margin-right: 16px;
`
const Dropdowns = styled.div<any>`
  > div {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`
const DefaultDropdowns = styled.div<any>`
  display: flex;
  margin-bottom: 0;
  margin-left: -16px;
  > div {
    margin-left: 16px;
  }
`
const NoStorageMessage = styled.div<any>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 64px;
  width: 440px;
`
const BigStorageImage = styled.div<any>`
  margin-bottom: 46px;
  ${StyleProps.exactSize('96px')}
  background: url('${bigStorageImage}') center no-repeat;
`
const NoStorageTitle = styled.div<any>`
  margin-bottom: 10px;
  font-size: 18px;
`
const NoStorageSubtitle = styled.div<any>`
  color: ${Palette.grayscale[4]};
  text-align: center;
`
const DiskDisabledMessage = styled.div<any>`
  width: 224px;
  text-align: center;
  color: gray;
`

export const getDisks = (instancesDetails: Instance[], type: 'backend' | 'disk', storageMap?: StorageMap[] | null): Disk[] => {
  const fieldName = type === 'backend' ? 'storage_backend_identifier' : 'id'

  let disks: Disk[] = []
  instancesDetails.forEach(instance => {
    if (!instance.devices || !instance.devices.disks) {
      return
    }
    instance.devices.disks.forEach(disk => {
      if (disks.find(d => d[fieldName] === disk[fieldName])) {
        return
      }
      disks.push(disk)
    })
  })
  if (disks.length === 0 && storageMap && storageMap.length) {
    disks = storageMap.map(sm => sm.source)
  }
  return disks
}

export const TEST_ID = 'wizardStorage'

export type Props = {
  storageBackends: StorageBackend[],
  instancesDetails: Instance[],
  storageMap: StorageMap[] | null | undefined,
  defaultStorageLayout: 'modal' | 'page',
  defaultStorage: { value: string | null, busType?: string | null },
  onDefaultStorageChange: (value: string | null, busType?: string | null) => void,
  onChange: (newMapping: StorageMap) => void,
  onScrollableRef?: (ref: HTMLElement) => void,
  style?: any,
  titleWidth?: number,
}
@observer
class WizardStorage extends React.Component<Props> {
  renderNoStorage() {
    return (
      <NoStorageMessage data-test-id={`${TEST_ID}-noStorage`}>
        <BigStorageImage />
        <NoStorageTitle>No storage backends were found</NoStorageTitle>
        <NoStorageSubtitle>
          We could not find any storage backends. Coriolis will skip this step.
        </NoStorageSubtitle>
      </NoStorageMessage>
    )
  }

  renderDisabledDisk(disk: Disk) {
    return (
      <DiskDisabledMessage>
        {disk.disabled!.message}{disk.disabled!.info
          ? <InfoIcon text={disk.disabled!.info} /> : null}
      </DiskDisabledMessage>
    )
  }

  renderBusTypeDropdown(selectedStorageMap: StorageMap | null | undefined) {
    if (!selectedStorageMap) {
      return null
    }
    type DropdownItem = {label: string, value: string | null}
    const storageBusTypes: DropdownItem[] | undefined = this.props.storageBackends
      .find(s => s.id === selectedStorageMap.target.id)?.additional_provider_properties?.supported_bus_types?.map(value => ({
        label: value,
        value,
      }))
    if (!storageBusTypes || !storageBusTypes.length) {
      return null
    }
    storageBusTypes.unshift({
      label: 'Choose a Bus Type',
      value: null,
    })
    const selectedBusType = selectedStorageMap?.targetBusType

    return (
      <Dropdown
        width={StyleProps.inputSizes.large.width}
        noSelectionMessage="Choose a Bus Type"
        centered
        items={storageBusTypes}
        selectedItem={selectedBusType}
        onChange={(item: DropdownItem) => {
          this.props.onChange({ ...selectedStorageMap, targetBusType: item.value })
        }}
      />
    )
  }

  renderStorageDropdown(
    storageItems: Array<StorageBackend>,
    selectedItem: StorageBackend | null | undefined,
    disk: Disk,
    type: 'backend' | 'disk',
  ) {
    return storageItems.length > 10 ? (
      <AutocompleteDropdown
        width={StyleProps.inputSizes.large.width}
        selectedItem={selectedItem}
        items={storageItems}
        onChange={(item: StorageBackend) => { this.props.onChange({ source: disk, target: item, type }) }}
        labelField="name"
        valueField="id"
      />
    )
      : (
        <Dropdown
          width={StyleProps.inputSizes.large.width}
          centered
          noSelectionMessage="Default"
          noItemsMessage="No storage found"
          selectedItem={selectedItem}
          items={storageItems}
          labelField="name"
          valueField="id"
          onChange={(item: StorageBackend) => { this.props.onChange({ source: disk, target: item, type }) }}
          data-test-id={`${TEST_ID}-${type}-destination`}
        />
      )
  }

  renderStorageWrapper(disks: Disk[], type: 'backend' | 'disk') {
    const title = type === 'backend' ? 'Storage Backend Mapping' : 'Disk Mapping'
    const diskFieldName = type === 'backend' ? 'storage_backend_identifier' : 'id'
    const storageMap = this.props.storageMap
    const storageItems = [
      { name: 'Default', id: null },
      ...this.props.storageBackends,
    ]

    const usableDisks = disks.filter(d => d[diskFieldName])

    const parseDiskName = (name?: string | null): [string | null, boolean] => {
      if (!name) {
        return [null, false]
      }
      const slashPaths = name.split('/')
      const dashPaths = name.split('-')
      if (slashPaths.length < 4 && dashPaths.length < 4) {
        return [name, false]
      }
      if (slashPaths.length >= 4) {
        return [`.../${slashPaths.filter((_, i) => i > slashPaths.length - 4).join('/')}`, true]
      }
      return [`${dashPaths[0]}-...-${dashPaths[1]}`, true]
    }

    return (
      <StorageWrapper>
        <StorageSection>{title}</StorageSection>
        <StorageItems>
          {usableDisks.map(disk => {
            const connectedToInstances = this.props.instancesDetails.filter(i => {
              if (!i.devices || !i.devices.disks) {
                return false
              }
              if (i.devices.disks.find(d => d[diskFieldName] === disk[diskFieldName])) {
                return true
              }
              return false
            }).map(instance => `${instance.name} (${InstanceUtils.shortenId(instance.instance_name || instance.id)})`)

            const selectedStorageMapping = storageMap?.find(s => s.type === type
                && String(s.source[diskFieldName]) === String(disk[diskFieldName]))
            const diskNameParsed = parseDiskName(disk[diskFieldName])
            return (
              <StorageItem key={disk[diskFieldName]}>
                <StorageImage backend={type === 'backend'} />
                <StorageTitle width={this.props.titleWidth || 320}>
                  <StorageName title={diskNameParsed[1] ? disk[diskFieldName] : null}>
                    {diskNameParsed[0]}
                  </StorageName>
                  {connectedToInstances.length ? (
                    <StorageSubtitle>
                      {`Connected to ${connectedToInstances.join(', ')}`}
                    </StorageSubtitle>
                  ) : null}
                </StorageTitle>
                <ArrowImage />
                <Dropdowns>
                  {disk.disabled && type === 'disk' ? this.renderDisabledDisk(disk) : (
                    <>
                      {this.renderStorageDropdown(storageItems, selectedStorageMapping?.target, disk, type)}
                      {this.renderBusTypeDropdown(selectedStorageMapping)}
                    </>
                  )}
                </Dropdowns>
              </StorageItem>
            )
          })}
        </StorageItems>
      </StorageWrapper>
    )
  }

  renderBackendMapping() {
    const disks = getDisks(this.props.instancesDetails, 'backend', this.props.storageMap)

    if (disks.length === 0 || this.props.storageBackends.length === 0) {
      return null
    }

    return this.renderStorageWrapper(disks, 'backend')
  }

  renderDiskMapping() {
    const disks = getDisks(this.props.instancesDetails, 'disk', this.props.storageMap)

    if (disks.length === 0 || this.props.storageBackends.length === 0) {
      return this.renderNoStorage()
    }

    return this.renderStorageWrapper(disks, 'disk')
  }

  renderDefaultStorage() {
    const disks = getDisks(this.props.instancesDetails, 'disk', this.props.storageMap)

    if (disks.length === 0 || this.props.storageBackends.length === 0) {
      return null
    }

    const renderDropdown = () => {
      let items: {label: string, value: string | null}[] = this.props.storageBackends.map(s => ({
        label: s.name,
        value: s.name,
      }))
      items = [
        { label: 'Choose a value', value: null },
        ...items,
      ]
      const selectedItem = items.find(i => i.value === this.props.defaultStorage.value)
      const commonProps = {
        width: StyleProps.inputSizes.regular.width,
        selectedItem,
        items,
        onChange: (item: { value: string | null }) => this.props.onDefaultStorageChange(item.value),
      }
      return items.length > 10 ? (
        <AutocompleteDropdown
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...commonProps}
          dimNullValue
        />
      )
        : (
          <Dropdown
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...commonProps}
            noSelectionMessage="Choose a value"
            dimFirstItem
          />
        )
    }

    const renderDefaultBusTypeDropdown = () => {
      if (!this.props.defaultStorage || !this.props.defaultStorage.value) {
        return null
      }

      type DropdownItem = { label: string, value: string | null }
      const storageBusTypes: DropdownItem[] | undefined = this.props.storageBackends
        .find(s => s.id === this.props.defaultStorage?.value)?.additional_provider_properties?.supported_bus_types?.map(value => ({
          label: value,
          value,
        }))
      if (!storageBusTypes || !storageBusTypes.length) {
        return null
      }
      storageBusTypes.unshift({
        label: 'Choose a Bus Type',
        value: null,
      })
      const selectedBusType = this.props.defaultStorage.busType

      return (
        <Dropdown
          width={StyleProps.inputSizes.regular.width}
          noSelectionMessage="Choose a Bus Type"
          centered
          items={storageBusTypes}
          selectedItem={selectedBusType}
          onChange={(item: DropdownItem) => {
            this.props.onDefaultStorageChange(this.props.defaultStorage?.value || null, item.value)
          }}
        />
      )
    }

    return (
      <StorageWrapper>
        <StorageSection>
          Default Storage
          <InfoIcon
            text="Storage type on the destination to default to"
            marginLeft={8}
            marginBottom={0}
          />
        </StorageSection>
        <StorageItems>
          <StorageItem>
            <StorageImage backend="backend" />
            <StorageTitle width={this.props.titleWidth || 320}>
              <StorageName>
                <DefaultDropdowns>
                  {renderDropdown()}
                  {renderDefaultBusTypeDropdown()}
                </DefaultDropdowns>
              </StorageName>
            </StorageTitle>
          </StorageItem>
        </StorageItems>
      </StorageWrapper>
    )
  }

  render() {
    return (
      <Wrapper style={this.props.style} ref={this.props.onScrollableRef}>
        <Mapping>
          {this.renderDefaultStorage()}
          {this.renderBackendMapping()}
          {this.renderDiskMapping()}
        </Mapping>
      </Wrapper>
    )
  }
}

export default WizardStorage
