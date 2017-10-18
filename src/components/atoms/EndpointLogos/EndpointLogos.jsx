import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import awsSmallImage from './images/aws-small.svg'
import azureSmallImage from './images/azure-small.svg'
import opcSmallImage from './images/opc-small.svg'
import openstackSmallImage from './images/openstack-small.svg'
import oraclevmSmallImage from './images/oraclevm-small.svg'
import vmwareSmallImage from './images/vmware-small.svg'

const endpointImages = {
  azure: { small: azureSmallImage },
  openstack: { small: openstackSmallImage },
  opc: { small: opcSmallImage },
  oracle_vm: { small: oraclevmSmallImage },
  vmware_vsphere: { small: vmwareSmallImage },
  aws: { small: awsSmallImage },
}

const Wrapper = styled.div``
const SmallLogo = styled.div`
  width: 80px;
  height: 32px;
  background: url('${props => endpointImages[props.endpoint].small}') no-repeat center;
`

class EndpointLogos extends React.Component {
  static propTypes = {
    small: PropTypes.bool,
    endpoint: PropTypes.string,
  }

  render() {
    let small = this.props.small ? <SmallLogo endpoint={this.props.endpoint} /> : null
    return (
      <Wrapper>
        {small}
      </Wrapper>
    )
  }
}

export default EndpointLogos
