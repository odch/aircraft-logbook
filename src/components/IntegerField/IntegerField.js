import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'

class IntegerField extends React.Component {
  constructor(props) {
    super(props)
    this.numberInput = React.createRef()
  }

  handleChange = e => {
    const value = e.target.value
    if (/^-?\d*$/.test(value)) {
      const intValue = value ? parseInt(value) : undefined
      if (this.props.onChange) {
        this.props.onChange(intValue)
      }
    }
  }

  handleFocus = () => {
    this.numberInput.current.addEventListener('wheel', this.handleWheel, {
      passive: false // important to register as active listener to be able to use `preventDefault` in handle wheel
    })
  }

  handleBlur = () => {
    this.numberInput.current.removeEventListener('wheel', this.handleWheel)
  }

  handleWheel = e => {
    e.preventDefault() // prevent number from being changed by scrolling
  }

  render() {
    const { label, value, cy, margin, fullWidth, error, disabled } = this.props
    return (
      <TextField
        label={label}
        value={typeof value === 'number' ? value : ''}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        inputRef={this.numberInput}
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
