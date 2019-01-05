import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'

const formatWithTwoDecimals = value => Number(value).toFixed(2)

class DecimalField extends React.Component {
  state = {
    stringValue: this.props.value
      ? formatWithTwoDecimals(this.props.value / 100)
      : ''
  }

  handleChange = e => {
    this.setState({
      stringValue: e.target.value
    })
  }

  handleBlur = () => {
    const { onChange } = this.props

    const floatValue = parseFloat(this.state.stringValue)
    if (!isNaN(floatValue)) {
      const twoDecimals = Math.round(floatValue * 100) / 100
      this.setState({
        stringValue: formatWithTwoDecimals(twoDecimals)
      })

      if (onChange) {
        const hundredths = Math.round(twoDecimals * 100)
        onChange(hundredths)
      }
    }
  }

  render() {
    const { label, cy, margin, fullWidth, error } = this.props
    const { stringValue } = this.state
    return (
      <TextField
        label={label}
        value={stringValue}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        type="number"
        inputProps={{ step: '.01' }}
        data-cy={cy}
        margin={margin}
        fullWidth={fullWidth}
        error={error}
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
  error: PropTypes.bool
}

export default DecimalField
