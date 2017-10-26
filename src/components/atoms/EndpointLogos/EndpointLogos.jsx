import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import awsSmallImage from './images/aws-small.svg'
import azureSmallImage from './images/azure-small.svg'
import opcSmallImage from './images/opc-small.svg'
import openstackSmallImage from './images/openstack-small.svg'
import oraclevmSmallImage from './images/oraclevm-small.svg'
import vmwareSmallImage from './images/vmware-small.svg'

import awsMediumImage from './images/aws-medium.svg'
import azureMediumImage from './images/azure-medium.svg'
import opcMediumImage from './images/opc-medium.svg'
import openstackMediumImage from './images/openstack-medium.svg'
import oraclevmMediumImage from './images/oraclevm-medium.svg'
import vmwareMediumImage from './images/vmware-medium.svg'

import awsLargeImage from './images/aws-large.svg'
import azureLargeImage from './images/azure-large.svg'
import opcLargeImage from './images/opc-large.svg'
import openstackLargeImage from './images/openstack-large.svg'
import oraclevmLargeImage from './images/oraclevm-large.svg'
import vmwareLargeImage from './images/vmware-large.svg'

import awsDefaultImage from './images/aws.svg'
import azureDefaultImage from './images/azure.svg'
import opcDefaultImage from './images/opc.svg'
import openstackDefaultImage from './images/openstack.svg'
import oraclevmDefaultImage from './images/oraclevm.svg'
import vmwareDefaultImage from './images/vmware.svg'

const endpointImages = {
  azure: {
    small: azureSmallImage,
    medium: azureMediumImage,
    large: azureLargeImage,
    defaultSize: azureDefaultImage,
  },
  openstack: {
    small: openstackSmallImage,
    medium: openstackMediumImage,
    large: openstackLargeImage,
    defaultSize: openstackDefaultImage,
  },
  opc: {
    small: opcSmallImage,
    medium: opcMediumImage,
    large: opcLargeImage,
    defaultSize: opcDefaultImage,
  },
  oracle_vm: {
    small: oraclevmSmallImage,
    medium: oraclevmMediumImage,
    large: oraclevmLargeImage,
    defaultSize: oraclevmDefaultImage,
  },
  vmware_vsphere: {
    small: vmwareSmallImage,
    medium: vmwareMediumImage,
    large: vmwareLargeImage,
    defaultSize: vmwareDefaultImage,
  },
  aws: {
    small: awsSmallImage,
    medium: awsMediumImage,
    large: awsLargeImage,
    defaultSize: awsDefaultImage,
  },
}
const Wrapper = styled.div``
const SmallLogo = styled.div`
  width: 80px;
  height: 32px;
  background: url('${props => endpointImages[props.endpoint].small}') no-repeat center;
`
const MediumLogo = styled.div`
  width: 112px;
  height: 45px;
  background: url('${props => endpointImages[props.endpoint].medium}') no-repeat center;
`
const LargeLogo = styled.div`
  width: 192px;
  height: 128px;
  background: url('${props => endpointImages[props.endpoint].large}') no-repeat center;
`
const DefaultLogo = styled.div`
  width: 192px;
  height: 64px;
  background: url('${props => endpointImages[props.endpoint].defaultSize}') no-repeat center;
`

class EndpointLogos extends React.Component {
  static propTypes = {
    small: PropTypes.bool,
    medium: PropTypes.bool,
    large: PropTypes.bool,
    endpoint: PropTypes.string,
  }

  render() {
    if (!this.props.endpoint) {
      return null
    }

    let small = this.props.small ? <SmallLogo endpoint={this.props.endpoint} /> : null
    let medium = this.props.medium ? <MediumLogo endpoint={this.props.endpoint} /> : null
    let large = this.props.large ? <LargeLogo endpoint={this.props.endpoint} /> : null
    let defaultLogo = null

    if (!small && !medium && !large) {
      defaultLogo = <DefaultLogo endpoint={this.props.endpoint} />
    }

    return (
      <Wrapper>
        {small}
        {medium}
        {large}
        {defaultLogo}
      </Wrapper>
    )
  }
}

export default EndpointLogos
