import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'

class IntegerField extends React.Component {
  state = {
    focused: false
  }

  handleChange = e => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      const intValue = value ? parseInt(value) : undefined
      if (this.props.onChange) {
        this.props.onChange(intValue)
      }
    }
  }

  handleFocus = () => {
    this.setState({
      focused: true
    })
  }

  handleBlur = () => {
    this.setState({
      focused: false
    })
  }

  handleWheel = e => {
    if (this.state.focused === true) {
      e.preventDefault() // prevent number from being changed by scrolling
    }
  }

  render() {
    const { label, value, cy, margin, fullWidth, error, disabled } = this.props
    return (
      <TextField
        label={label}
        value={value || ''}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onWheel={this.handleWheel}
        cy={cy}
        type="number"
        margin={margin}
        fullWidth={fullWidth}
        error={error}
        disabled={disabled}
      />
    )
  }
}

IntegerField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  cy: PropTypes.string,
  margin: PropTypes.string,
  fullWidth: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  disabled: PropTypes.bool
}

export default IntegerField
