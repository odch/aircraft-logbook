import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'

const formatWithTwoDecimals = value => Number(value).toFixed(2)

class HoursCounterField extends React.Component {
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
        const hundredthsOfAnHour = Math.round(twoDecimals * 100)
        onChange(hundredthsOfAnHour)
      }
    }
  }

  render() {
    const { label, cy, margin, fullWidth } = this.props
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
      />
    )
  }
}

HoursCounterField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number, // integer value (hundredths of an hour)
  cy: PropTypes.string,
  margin: PropTypes.string,
  fullWidth: PropTypes.bool,
  onChange: PropTypes.func
}

export default HoursCounterField
