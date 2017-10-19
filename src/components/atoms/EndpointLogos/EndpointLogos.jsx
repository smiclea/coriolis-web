import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import awsSmallImage from './images/aws-small.svg'
import azureSmallImage from './images/azure-small.svg'
import opcSmallImage from './images/opc-small.svg'
import openstackSmallImage from './images/openstack-small.svg'
import oraclevmSmallImage from './images/oraclevm-small.svg'
import vmwareSmallImage from './images/vmware-small.svg'
import awsDefaultImage from './images/aws.svg'
import azureDefaultImage from './images/azure.svg'
import opcDefaultImage from './images/opc.svg'
import openstackDefaultImage from './images/openstack.svg'
import oraclevmDefaultImage from './images/oraclevm.svg'
import vmwareDefaultImage from './images/vmware.svg'

const endpointImages = {
  azure: {
    small: azureSmallImage,
    defaultSize: azureDefaultImage,
  },
  openstack: {
    small: openstackSmallImage,
    defaultSize: openstackDefaultImage,
  },
  opc: {
    small: opcSmallImage,
    defaultSize: opcDefaultImage,
  },
  oracle_vm: {
    small: oraclevmSmallImage,
    defaultSize: oraclevmDefaultImage,
  },
  vmware_vsphere: {
    small: vmwareSmallImage,
    defaultSize: vmwareDefaultImage,
  },
  aws: {
    small: awsSmallImage,
    defaultSize: awsDefaultImage,
  },
}

const Wrapper = styled.div``
const SmallLogo = styled.div`
  width: 80px;
  height: 32px;
  background: url('${props => endpointImages[props.endpoint].small}') no-repeat center;
`
const DefaultLogo = styled.div`
  width: 192px;
  height: 64px;
  background: url('${props => endpointImages[props.endpoint].defaultSize}') no-repeat center;
`

class EndpointLogos extends React.Component {
  static propTypes = {
    small: PropTypes.bool,
    endpoint: PropTypes.string,
  }

  render() {
    if (!this.props.endpoint) {
      return null
    }

    let small = this.props.small ? <SmallLogo endpoint={this.props.endpoint} /> : null
    let defaultLogo = null
    if (!small) {
      defaultLogo = <DefaultLogo endpoint={this.props.endpoint} />
    }

    return (
      <Wrapper>
        {small}
        {defaultLogo}
      </Wrapper>
    )
  }
}

export default EndpointLogos
