import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Modal, Button } from 'components'

import Palette from '../../styleUtils/Palette'

import questionImage from './images/question.svg'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
`
const Image = styled.div`
  width: 96px;
  height: 96px;
  background: url('${questionImage}');
  margin: 16px 0 48px 0;
`
const Message = styled.div`
  font-size: 18px;
`
const ExtraMessage = styled.div`
  color: ${Palette.grayscale[4]};
  margin: 11px 0 48px 0;
`
const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

class ConfirmationModal extends React.Component {
  static propTypes = {
    message: PropTypes.string,
    extraMessage: PropTypes.string,
    onRequestClose: PropTypes.func,
    onConfirmation: PropTypes.func,
  }

  render() {
    return (
      <Modal {...this.props}>
        <Wrapper>
          <Image />
          <Message>{this.props.message}</Message>
          <ExtraMessage>{this.props.extraMessage}</ExtraMessage>
          <Buttons>
            <Button secondary onClick={this.props.onRequestClose}>No</Button>
            <Button onClick={this.props.onConfirmation}>Yes</Button>
          </Buttons>
        </Wrapper>
      </Modal>
    )
  }
}

export default ConfirmationModal
