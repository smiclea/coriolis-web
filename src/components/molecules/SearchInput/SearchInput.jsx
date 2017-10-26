import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { SearchButton, TextInput } from 'components'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'

const Input = styled(TextInput) `
  position: absolute;
  top: -8px;
  left: -8px;
  padding-left: 32px;
  width: 50px;
  opacity: 0;
  transition: all ${StyleProps.animations.swift};
`
const InputAnimation = css`
  ${Input} {
    width: ${StyleProps.inputSizes.regular.width}px;
    opacity: 1;
  }
`

const Wrapper = styled.div`
  position: relative;

  ${props => props.open ? InputAnimation : ''}
`
const SearchButtonStyled = styled(SearchButton)`
  position: relative;
`

class SearchInput extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
  }

  constructor() {
    super()

    this.state = {
      open: false,
    }

    this.handlePageClick = this.handlePageClick.bind(this)
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handlePageClick, false)
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handlePageClick, false)
  }

  handlePageClick() {
    if (!this.itemMouseDown) {
      this.setState({ open: false })
    }
  }

  handleSearchButtonClick() {
    this.input.focus()
    this.setState({ open: !this.state.open })
  }

  render() {
    return (
      <Wrapper
        open={this.state.open}
        onMouseDown={() => { this.itemMouseDown = true }}
        onMouseUp={() => { this.itemMouseDown = false }}
      >
        <Input
          _ref={input => { this.input = input }}
          placeholder="Search"
          onChange={e => { this.props.onChange(e.target.value) }}
        />
        <SearchButtonStyled primary={this.state.open} onClick={() => { this.handleSearchButtonClick() }} />
      </Wrapper>
    )
  }
}

export default SearchInput
