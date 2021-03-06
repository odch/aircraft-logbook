/* eslint react/prop-types: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Select, { createFilter } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import Async from 'react-select/async'
import AsyncCreatableSelect from 'react-select/async-creatable'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import NoSsr from '@material-ui/core/NoSsr'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import MenuItem from '@material-ui/core/MenuItem'
import CancelIcon from '@material-ui/icons/Cancel'
import { emphasize } from '@material-ui/core/styles/colorManipulator'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  input: {
    display: 'flex',
    padding: '6px 0 11px'
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center'
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: 4
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0
  }
})

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />
}

function Control(props) {
  return (
    <TextField
      margin={props.selectProps.margin}
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  )
}

function Option(props) {
  // eslint-disable-next-line no-unused-vars
  const { onMouseMove, onMouseOver, ...newInnerProps } = props.innerProps // remove event handlers to fix lag
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
        whiteSpace: 'normal'
      }}
      {...newInnerProps}
      data-cy={`option-${props.data.value}`}
    >
      {props.children}
    </MenuItem>
  )
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  )
}

ValueContainer.propTypes = {
  selectProps: PropTypes.shape({
    classes: PropTypes.object
  }),
  children: PropTypes.arrayOf(PropTypes.node)
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  )
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  )
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
}

const isValidNewOption = (inputValue /*, selectValue, selectOptions*/) =>
  inputValue.length >= 3

const noOptionsMessage = ({ inputValue }) => {
  if (!inputValue || inputValue.length < 3) {
    return 'Gib mindestens drei Zeichen ein...'
  }
  return 'Kein Eintrag gefunden'
}

class IntegrationReactSelect extends React.Component {
  getSelectCmp = () => {
    if (this.props.creatable === true && this.props.loadOptions) {
      return AsyncCreatableSelect
    }
    if (this.props.creatable === true) {
      return CreatableSelect
    }
    if (this.props.loadOptions) {
      return Async
    }
    return Select
  }

  render() {
    const {
      options,
      loadOptions,
      value,
      onChange,
      isMulti,
      label,
      classes,
      margin,
      required,
      error,
      disabled,
      clearable,
      onCreateOption,
      onCreateOptionText,
      cy
    } = this.props

    const selectStyles = {
      input: base => ({
        ...base,
        '& input': {
          font: 'inherit'
        }
      }),
      dropdownIndicator: base => ({
        ...base,
        padding: 6
      })
    }

    const Cmp = this.getSelectCmp()

    return (
      <div className={classes.root}>
        <NoSsr>
          <Cmp
            classes={classes}
            styles={selectStyles}
            margin={margin}
            options={!loadOptions ? options : undefined}
            loadOptions={
              loadOptions
                ? (inputValue, callback) => {
                    if (!inputValue || inputValue.length < 3) {
                      callback([])
                    } else {
                      loadOptions(inputValue, callback)
                    }
                  }
                : undefined
            }
            components={components}
            value={value}
            onChange={onChange}
            isMulti={isMulti}
            isDisabled={disabled}
            isClearable={clearable}
            onCreateOption={onCreateOption}
            formatCreateLabel={() =>
              onCreateOptionText ||
              'Klicke hier, um eine neue Option zu erstellen'
            }
            isValidNewOption={isValidNewOption}
            noOptionsMessage={noOptionsMessage}
            placeholder=""
            textFieldProps={{
              label,
              required,
              error,
              disabled,
              'data-cy': cy,
              InputLabelProps: {
                shrink: true
              }
            }}
            filterOption={createFilter({ ignoreAccents: false })} // fix lag for large lists
          />
        </NoSsr>
      </div>
    )
  }
}

IntegrationReactSelect.defaultProps = {
  clearable: true
}

IntegrationReactSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  loadOptions: PropTypes.func,
  value: PropTypes.object,
  isMulti: PropTypes.bool,
  required: PropTypes.bool,
  label: PropTypes.string,
  classes: PropTypes.object.isRequired,
  margin: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  creatable: PropTypes.bool,
  clearable: PropTypes.bool,
  onCreateOption: PropTypes.func,
  onCreateOptionText: PropTypes.string,
  cy: PropTypes.string
}

export default withStyles(styles)(IntegrationReactSelect)
