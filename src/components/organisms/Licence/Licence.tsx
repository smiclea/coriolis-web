/*
Copyright (C) 2019  Cloudbase Solutions SRL
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
import { observer } from 'mobx-react'
import styled, { css } from 'styled-components'
import moment from 'moment'

import Button from '../../atoms/Button'
import LoadingButton from '../../molecules/LoadingButton'
import StatusImage from '../../atoms/StatusImage'
import TextArea from '../../atoms/TextArea'
import CopyValue from '../../atoms/CopyValue'

import StyleProps from '../../styleUtils/StyleProps'
import Palette from '../../styleUtils/Palette'
import FileUtils from '../../../utils/FileUtils'

import type { Licence } from '../../../@types/Licence'

import licenceImage from './images/licence'

const Wrapper = styled.div<any>`
  min-height: 0;
  overflow: auto;
  width: 100%;
`
const TextAreaStyled = styled(TextArea)`
  ${props => (props.dropzone ? css`
    border: 1px dashed ${Palette.primary};
  ` : '')}
`
const LicenceInfoWrapper = styled.div<any>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  padding: 0 32px;
`
const LicenceRow = styled.div<any>`
  display: flex;
  margin-top: 16px;
`
const LicenceRowLabel = styled.div<any>`
  display: flex;
  align-items: center;
  font-weight: ${StyleProps.fontWeights.medium};
  font-size: 10px;
  text-transform: uppercase;
  color: ${Palette.grayscale[3]};
`
const LicenceLink = styled.span`
  text-transform: initial;
  color: ${Palette.primary};
  font-weight: ${StyleProps.fontWeights.regular};
  cursor: pointer;
`
const LicenceRowContent = styled.div<any>`
  ${props => (props.width ? css`width: ${props.width};` : '')}
`
const LicenceRowDescription = styled.div<any>`
  margin-top: 4px;
`
const LoadingWrapper = styled.div<any>`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const ButtonsWrapper = styled.div<any>`
  display: flex;
  margin-top: 48px;
  justify-content: ${props => (props.spaceBetween ? 'space-between' : 'center')};
  padding: 0 32px;
`
const Logo = styled.div<any>`
  width: 96px;
  height: 96px;
  margin: 0 auto;
  text-align: center;
`
const LicenceAddWrapper = styled.div<any>`
  padding: 0 32px;
`
const Description = styled.div<any>`
  color: ${Palette.grayscale[3]};
`
const FakeFileInput = styled.input`
  position: absolute;
  opacity: 0;
  top: -99999px;
`

type Props = {
  licenceInfo: Licence | null,
  licenceError: string | null,
  loadingLicenceInfo: boolean,
  onRequestClose: () => void,
  onAddModeChange: (addMode: boolean) => void,
  addMode: boolean,
  onAddLicence: (licence: string) => void,
  addingLicence: boolean,
}
type State = {
  licence: string,
  isValid: boolean,
  highlightDropzone: boolean,
}

@observer
class LicenceC extends React.Component<Props, State> {
  state = {
    licence: '',
    isValid: false,
    highlightDropzone: false,
  }

  fileInput!: HTMLElement

  dragDropListeners: { type: string, listener: (e: any) => any }[] = []

  UNSAFE_componentWillReceiveProps(newProps: Props) {
    if (newProps.addMode === this.props.addMode) {
      return
    }

    if (newProps.addMode) {
      setTimeout(() => { this.addDragAndDrop() }, 1000)
    } else {
      this.setState({ licence: '' })
      this.removeDragDrop()
    }
  }

  addDragAndDrop() {
    this.dragDropListeners = [{
      type: 'dragenter',
      listener: e => {
        this.setState({ highlightDropzone: true })
        e.dataTransfer.dropEffect = 'copy'
        e.preventDefault()
      },
    }, {
      type: 'dragover',
      listener: e => {
        e.dataTransfer.dropEffect = 'copy'
        e.preventDefault()
      },
    }, {
      type: 'dragleave',
      listener: e => {
        if (!e.clientX && !e.clientY) {
          this.setState({ highlightDropzone: false })
        }
      },
    }, {
      type: 'drop',
      listener: async e => {
        e.preventDefault()
        this.setState({ highlightDropzone: false })
        const text = await FileUtils.readTextFromFirstFile(e.dataTransfer.files)
        if (text) {
          this.handleLicenceChange(text)
        }
      },
    }]

    this.dragDropListeners.forEach(l => {
      window.addEventListener(l.type, l.listener)
    })
  }

  removeDragDrop() {
    this.dragDropListeners.forEach(l => {
      window.removeEventListener(l.type, l.listener)
    })
    this.dragDropListeners = []
  }

  validate() {
    let isValid = true
    if (this.state.licence.indexOf('-----BEGIN CORIOLIS LICENCE-----') !== 0) {
      isValid = false
    }
    if (this.state.licence.indexOf('-----END CORIOLIS LICENCE-----') === -1) {
      isValid = false
    }
    this.setState({ isValid })
  }

  handleAddLicenceClick() {
    this.props.onAddModeChange(true)
  }

  handleAddButtonClick() {
    this.props.onAddLicence(this.state.licence)
  }

  handleLicenceChange(licence: string) {
    this.setState({ licence }, () => { this.validate() })
  }

  handleUploadClick() {
    this.fileInput.click()
  }

  async handleFileUpload(files: FileList) {
    const text = await FileUtils.readTextFromFirstFile(files)
    if (text) {
      this.handleLicenceChange(text)
    }
  }

  renderLicenceInfoLoading() {
    return (
      <LoadingWrapper>
        <StatusImage loading />
      </LoadingWrapper>
    )
  }

  renderExpiration(date: Date) {
    const dateMoment = moment(date)
    const days = dateMoment.diff(new Date(), 'days')
    if (days === 0) {
      return (
        <span>today at <b>{dateMoment.utc().format('HH:mm')} UTC</b></span>
      )
    }
    return (
      <span>on <b>{dateMoment.format('DD MMM YYYY')} ({days} days from now)</b></span>
    )
  }

  renderLicenceStatusText(info: Licence): React.ReactNode {
    if (new Date(info.earliestLicenceExpiryDate).getTime() < new Date().getTime()) {
      return 'Please contact Cloudbase Solutions with your Appliance ID in order to obtain a Coriolis® licence'
    }
    return (
      <LicenceRowDescription>
        Earliest Coriolis® Licence expires
        {this.renderExpiration(info.earliestLicenceExpiryDate)}.<br />
        Latest Coriolis® Licence expires {this.renderExpiration(info.latestLicenceExpiryDate)}.
      </LicenceRowDescription>
    )
  }

  renderLicenceError(error: string) {
    return <LicenceInfoWrapper>{error}</LicenceInfoWrapper>
  }

  renderLicenceInfo(info: Licence) {
    return (
      <LicenceInfoWrapper>
        <LicenceRow>
          <LicenceRowContent>
            <LicenceRowLabel>
              Licence
              <LicenceLink
                style={{ marginLeft: '8px' }}
                onClick={() => { this.handleAddLicenceClick() }}
              >Add Licence
              </LicenceLink>
            </LicenceRowLabel>
            {this.renderLicenceStatusText(info)}
          </LicenceRowContent>
        </LicenceRow>
        <LicenceRow>
          <LicenceRowContent>
            <LicenceRowLabel>Appliance ID</LicenceRowLabel>
            <LicenceRowDescription>
              <CopyValue value={info.applianceId} />
            </LicenceRowDescription>
          </LicenceRowContent>
        </LicenceRow>
      </LicenceInfoWrapper>
    )
  }

  renderButtons() {
    return (
      <ButtonsWrapper spaceBetween={this.props.addMode}>
        {this.props.addMode ? (
          <Button
            secondary
            large
            onClick={() => { this.props.onAddModeChange(false) }}
          >Back
          </Button>
        )
          : (
            <Button
              secondary
              large
              onClick={() => { this.props.onRequestClose() }}
            >Close
            </Button>
          )}
        {(this.props.addMode && !this.props.addingLicence) ? (
          <Button
            large
            onClick={() => { this.handleAddButtonClick() }}
            disabled={!this.state.isValid}
          >Add Licence
          </Button>
        )
          : (this.props.addMode && this.props.addingLicence)
            ? (
              <LoadingButton
                large
                onClick={() => { this.handleAddButtonClick() }}
              >Add Licence
              </LoadingButton>
            )
            : null}
      </ButtonsWrapper>
    )
  }

  renderLicenceAdd() {
    const LicenceLinkComponent = (
      <LicenceLink
        onClick={() => { this.handleUploadClick() }}
      >upload
      </LicenceLink>
    )

    return (
      <LicenceAddWrapper>
        <Logo
          dangerouslySetInnerHTML={
            { __html: licenceImage(this.state.isValid ? Palette.primary : Palette.grayscale[5]) }
          }
        />
        <LicenceRowLabel style={{ marginTop: '32px' }}>Licence</LicenceRowLabel>
        <TextAreaStyled
          placeholder="Paste/Drag Licence file here ..."
          dropzone={this.state.highlightDropzone}
          style={{
            width: '100%',
            marginTop: '4px',
          }}
          value={this.state.licence}
          onChange={(e: any) => { this.handleLicenceChange(e.target.value) }}
        />
        <Description>
          Drag the Licence file or paste the contents in box above.
          <br />Alternatively you can {LicenceLinkComponent} the file.
        </Description>
        <FakeFileInput
          type="file"
          ref={r => { this.fileInput = r as HTMLElement }}
          accept=".pem, .txt"
          onChange={(e: any) => { this.handleFileUpload(e.target.files) }}
        />
      </LicenceAddWrapper>
    )
  }

  render() {
    const showInfo = !this.props.loadingLicenceInfo
      && !this.props.addMode && !this.props.licenceError
    const showError = !this.props.loadingLicenceInfo && !this.props.addMode

    return (
      <Wrapper>
        {showInfo && this.props.licenceInfo ? this.renderLicenceInfo(this.props.licenceInfo) : null}
        {showError && this.props.licenceError
          ? this.renderLicenceError(this.props.licenceError) : null}
        {this.props.addMode ? this.renderLicenceAdd() : null}
        {this.props.loadingLicenceInfo ? this.renderLicenceInfoLoading() : null}
        {this.renderButtons()}
      </Wrapper>
    )
  }
}

export default LicenceC
