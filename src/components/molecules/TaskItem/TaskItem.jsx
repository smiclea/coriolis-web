import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import moment from 'moment'
import LinesEllipsis from 'react-lines-ellipsis'
import { Collapse } from 'react-collapse'

import { StatusIcon, Arrow, StatusPill, IdValue, ProgressBar } from 'components'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const Wrapper = styled.div`
  cursor: pointer;
  border-bottom: 1px solid white;
  transition: all ${StyleProps.animations.swift};
  ${props => props.open ? `background: ${Palette.grayscale[0]};` : ''}
  &:hover {
    background: ${Palette.grayscale[0]};
  }
`
const ArrowStyled = styled(Arrow) `
  position: absolute;
  left: -24px;
`
const Header = styled.div`
  display: flex;
  padding: 8px;
  position: relative;
  &:hover ${ArrowStyled} {
    opacity: 1;
  }
`
const HeaderData = styled.div`
  display: block;
  ${props => props.capitalize ? 'text-transform: capitalize;' : ''}
  width: ${props => props.width};
  color: ${props => props.black ? Palette.black : Palette.grayscale[4]};
  padding-right: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
`
const Title = styled.div`
  display: flex;
`
const TitleText = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  color: ${Palette.grayscale[4]};
`
const Columns = styled.div`
  display: flex;
  flex-direction: row;
`
const Row = styled.div`
  ${props => props.margin ? 'margin-left: 32px;' : ''}
  ${props => props.noPadding ? '' : 'padding-bottom: 16px;'}
  word-break: break-word;
`
const Column = styled.div`
  width: ${props => props.width || 'auto'};
`
const Label = styled.div`
  text-transform: uppercase;
  font-size: 10px;
  font-weight: ${StyleProps.fontWeights.medium};
  color: ${Palette.grayscale[5]};
  margin-bottom: 4px;
`
const Value = styled.div`
  ${props => props.margin ? 'margin-left: 32px;' : ''}
`
const ProgressUpdates = styled.div`
  color: ${Palette.black};
`
const ProgressUpdate = styled.div`
  display: flex;
`
const ProgressUpdateDate = styled.div`
  min-width: ${props => props.width || 'auto'};
  & > span {margin-left: 32px;}
`
const ProgressUpdateValue = styled.div`
  margin-right: 32px;
`

class TaskItem extends React.Component {
  static propTypes = {
    columnWidths: PropTypes.array,
    item: PropTypes.object,
    open: PropTypes.bool,
  }

  getLastMessage() {
    let message
    if (this.props.item.progress_updates.length &&
      this.props.item.progress_updates[this.props.item.progress_updates.length - 1]) {
      message = this.props.item.progress_updates[this.props.item.progress_updates.length - 1].message
    } else {
      message = '-'
    }

    return message
  }

  getMessageProgress(message) {
    let match = message.match(/.*progress.*?(100|\d{1,2})%/)
    return match && match[1]
  }

  renderHeader() {
    return (
      <Header>
        <HeaderData capitalize width={this.props.columnWidths[0]} black>
          <Title>
            <StatusIcon status={this.props.item.status} style={{ marginRight: '8px' }} />
            <TitleText>{this.props.item.task_type.replace(/_/g, ' ').toLowerCase()}</TitleText>
          </Title>
        </HeaderData>
        <HeaderData width={this.props.columnWidths[1]}>
          {this.props.item.instance}
        </HeaderData>
        <HeaderData width={this.props.columnWidths[2]}>
          {this.getLastMessage()}
        </HeaderData>
        <HeaderData width={this.props.columnWidths[3]}>
          {this.props.item.created_at ? moment(this.props.item.created_at).format('YYYY-MM-DD HH:mm:ss') : '-'}
        </HeaderData>
        <ArrowStyled primary orientation={this.props.open ? 'up' : 'down'} opacity={this.props.open ? 1 : 0} />
      </Header>
    )
  }

  renderDependsOnValue() {
    if (this.props.item.depends_on && this.props.item.depends_on[0]) {
      return <IdValue value={this.props.item.depends_on[0]} autoWidth />
    }

    return <Value>N/A</Value>
  }

  renderProgressUpdates() {
    let naValue = <Value margin>N/A</Value>
    if (!this.props.item.progress_updates.length) {
      return naValue
    }

    if (this.props.item.progress_updates[0] !== null) {
      this.props.item.progress_updates.sort((a, b) => moment(a.created_at).isAfter(moment(b.created_at)))
    }

    return (
      <ProgressUpdates>
        {this.props.item.progress_updates.map((update, i) => {
          if (!update) {
            return <Value>N/A</Value>
          }
          let messageProgress = this.getMessageProgress(update.message)

          return (
            <ProgressUpdate key={i}>
              <ProgressUpdateDate width={this.props.columnWidths[0]}>
                <span>{moment(update.created_at).format('YYYY-MM-DD HH:mm:ss')}</span>
              </ProgressUpdateDate>
              <ProgressUpdateValue>
                {update.message}
                {messageProgress && <ProgressBar style={{ margin: '8px 0' }} progress={Number(messageProgress)} />}
              </ProgressUpdateValue>
            </ProgressUpdate>
          )
        })}
      </ProgressUpdates>
    )
  }

  renderBody() {
    let exceptionsText = (this.props.item.exception_details && this.props.item.exception_details.length
      && this.props.item.exception_details) || 'N/A'

    return (
      <Collapse isOpened={this.props.open} springConfig={{ stiffness: 100, damping: 20 }}>
        <Body>
          <Columns>
            <Column width={this.props.columnWidths[0]}>
              <Row margin>
                <Label>Status</Label>
                <StatusPill small status={this.props.item.status} />
              </Row>
              <Row margin>
                <Label>Exception Details</Label>
                <LinesEllipsis
                  maxLine="10"
                  text={exceptionsText}
                />
              </Row>
              <Row margin noPadding>
                <Label>Progress Updates</Label>
              </Row>
            </Column>
            <Column>
              <Row>
                <Label>ID</Label>
                <IdValue value={this.props.item.id} autoWidth />
              </Row>
              <Row>
                <Label>Depends on</Label>
                {this.renderDependsOnValue()}
              </Row>
            </Column>
          </Columns>
          {this.renderProgressUpdates()}
        </Body>
      </Collapse>
    )
  }

  render() {
    return (
      <Wrapper {...this.props}>
        {this.renderHeader()}
        {this.renderBody()}
      </Wrapper>
    )
  }
}

export default TaskItem
