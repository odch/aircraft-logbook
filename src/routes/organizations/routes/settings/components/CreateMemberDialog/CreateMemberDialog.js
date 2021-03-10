import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemText from '@material-ui/core/ListItemText'
import { withStyles } from '@material-ui/core/styles'
import DialogContentText from '@material-ui/core/DialogContentText'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import { intl as intlShape } from '../../../../../../shapes'

const styles = theme => ({
  loadingIndicator: {
    marginRight: 5
  },
  inviteText: {
    marginTop: theme.spacing(0.2) + 'em'
  }
})

class CreateMemberDialog extends React.Component {
  handleChange = name => e => {
    this.updateData(name, e.target.value)
  }

  handleCheckboxChange = name => e => {
    this.updateData(name, e.target.checked)
  }

  updateData = (name, value) => {
    this.props.updateData({
      [name]: value
    })
  }

  handleClose = () => {
    const { onClose, submitting } = this.props

    if (submitting !== true && onClose) {
      onClose()
    }
  }

  handleSubmit = e => {
    const { onSubmit, organizationId, data, submitting } = this.props

    e.preventDefault()
    if (submitting !== true && onSubmit) {
      onSubmit(organizationId, data)
    }
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const { roles, submitting, limitReached, classes, onClose } = this.props
    return (
      <Dialog onClose={this.handleClose} data-cy="member-create-dialog" open>
        <DialogTitle>
          <FormattedMessage id="organization.member.create.dialog.title" />
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent>
            {this.renderTextField('firstname', true, true)}
            {this.renderTextField('lastname', false, true)}
            {this.renderTextField('nr', false, false)}
            {this.renderMultiSelect('roles', roles)}
            {this.renderCheckbox('instructor')}
            <DialogContentText className={classes.inviteText}>
              {this.msg('organization.member.create.dialog.invitation.text')}
            </DialogContentText>
            <FormControl fullWidth error={limitReached}>
              {this.renderTextField(
                'inviteEmail',
                false,
                false,
                'email',
                limitReached
              )}
              {limitReached && (
                <FormHelperText>
                  <FormattedMessage id="organization.member.create.dialog.invitation.limitreached" />
                </FormHelperText>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={submitting}>
              <FormattedMessage id="organization.member.create.dialog.buttons.cancel" />
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              data-cy="create-button"
              disabled={submitting}
            >
              {submitting && (
                <CircularProgress
                  size={16}
                  className={classes.loadingIndicator}
                />
              )}
              <FormattedMessage id="organization.member.create.dialog.buttons.create" />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }

  renderTextField(name, autoFocus, required, type = 'text', disabled) {
    return (
      <TextField
        label={this.msg(`organization.member.create.dialog.${name}`)}
        type={type}
        fullWidth
        required={required}
        value={this.props.data[name]}
        onChange={this.handleChange(name)}
        data-cy={`${name}-field`}
        disabled={disabled || this.props.submitting}
        autoFocus={autoFocus}
      />
    )
  }

  renderMultiSelect(name, options) {
    const selectedValues = this.props.data[name] || []
    return (
      <FormControl fullWidth>
        <InputLabel>
          <FormattedMessage id={`organization.member.create.dialog.${name}`} />
        </InputLabel>
        <Select
          value={selectedValues}
          onChange={this.handleChange(name)}
          input={<Input />}
          renderValue={selectedValues =>
            selectedValues
              .map(selected => {
                const selectedOption = options.find(
                  option => option.value === selected
                )
                return selectedOption ? selectedOption.label : selected
              })
              .join(', ')
          }
          disabled={this.props.submitting}
          multiple
        >
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={selectedValues.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }

  renderCheckbox(name) {
    return (
      <FormControlLabel
        value={name}
        control={
          <Checkbox
            color="primary"
            checked={this.props.data[name] === true}
            onChange={this.handleCheckboxChange(name)}
          />
        }
        label={this.msg(`organization.member.create.dialog.${name}`)}
        labelPlacement="end"
        disabled={this.props.submitting}
      />
    )
  }
}

CreateMemberDialog.propTypes = {
  organizationId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    nr: PropTypes.string,
    inviteEmail: PropTypes.string
  }).isRequired,
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  submitting: PropTypes.bool,
  limitReached: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  intl: intlShape,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(CreateMemberDialog))
