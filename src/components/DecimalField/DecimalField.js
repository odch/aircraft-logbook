import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'

const formatWithTwoDecimals = value => Number(value).toFixed(2)

class DecimalField extends React.Component {
  state = {
    stringValue:
      typeof this.props.value === 'number'
        ? formatWithTwoDecimals(this.props.value / 100)
        : ''
  }

  constructor(props) {
    super(props)
    this.numberInput = React.createRef()
  }

  handleChange = e => {
    this.setState({
      stringValue: e.target.value
    })
  }

  handleFocus = () => {
    this.numberInput.current.addEventListener('wheel', this.handleWheel, {
      passive: false // important to register as active listener to be able to use `preventDefault` in handle wheel
    })
  }

  handleBlur = () => {
    const { onChange } = this.props

    this.numberInput.current.removeEventListener('wheel', this.handleWheel)

    const floatValue = parseFloat(this.state.stringValue)
    if (!isNaN(floatValue)) {
      const twoDecimals = Math.round(floatValue * 100) / 100
      const stringValue = formatWithTwoDecimals(twoDecimals)

      this.setState({
        stringValue
      })

      if (onChange) {
        const hundredths = Math.round(twoDecimals * 100)
        onChange(hundredths)
      }
    } else if (this.state.stringValue === '' && onChange) {
      onChange(null)
    }
  }

  handleWheel = e => {
    e.preventDefault() // prevent number from being changed by scrolling
  }

  render() {
    const { label, cy, margin, fullWidth, error, disabled } = this.props
    const { stringValue } = this.state
    return (
      <TextField
        label={label}
        value={stringValue}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        inputRef={this.numberInput}
        type="number"
        inputProps={{ step: '.01' }}
        data-cy={cy}
        margin={margin}
        fullWidth={fullWidth}
        error={error}
        disabled={disabled}
      />
    )
  }
}

DecimalField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number, // integer value (hundredths)
  cy: PropTypes.string,
  margin: PropTypes.string,
  fullWidth: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  disabled: PropTypes.bool
}

export default DecimalField
