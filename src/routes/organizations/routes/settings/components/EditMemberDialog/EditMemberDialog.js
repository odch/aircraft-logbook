import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import {
  member as memberShape,
  intl as intlShape
} from '../../../../../../shapes'
import { formatDate, formatTime } from '../../../../../../util/dates'

const styles = theme => ({
  loadingIndicator: {
    marginRight: 5
  },
  inviteText: {
    marginTop: theme.spacing(0.2) + 'em'
  },
  reinviteCheckbox: {
    marginTop: theme.spacing(0.1) + 'em'
  }
})

class EditMemberDialog extends React.Component {
  handleClose = () => {
    if (!this.props.submitting && this.props.onClose) {
      this.props.onClose()
    }
  }

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

  handleSubmit = e => {
    const { onSubmit, organizationId, member, data, submitting } = this.props

    e.preventDefault()
    if (submitting !== true && onSubmit) {
      onSubmit(organizationId, member.id, data)
    }
  }

  msg = (id, values) => this.props.intl.formatMessage({ id }, values)

  render() {
    const { roles, submitting, classes } = this.props
    return (
      <Dialog onClose={this.handleClose} data-cy="member-edit-dialog" open>
        <DialogTitle>
          <FormattedMessage id="organization.member.edit.dialog.title" />
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent>
            {this.renderTextField('firstname', true, true)}
            {this.renderTextField('lastname', false, true)}
            {this.renderTextField('nr', false, false)}
            {this.renderMultiSelect('roles', roles)}
            {this.renderInviteEmailField()}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} disabled={submitting}>
              <FormattedMessage id="organization.member.edit.dialog.buttons.cancel" />
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
              <FormattedMessage id="organization.member.edit.dialog.buttons.save" />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }

  renderTextField(name, autoFocus, required, type = 'text') {
    return (
      <TextField
        label={this.msg(`organization.member.edit.dialog.${name}`)}
        type={type}
        fullWidth
        required={required}
        value={this.props.data[name]}
        onChange={this.handleChange(name)}
        data-cy={`${name}-field`}
        disabled={this.props.submitting}
        autoFocus={autoFocus}
      />
    )
  }

  renderMultiSelect(name, options) {
    const selectedValues = this.props.data[name] || []
    return (
      <FormControl fullWidth>
        <InputLabel>
          <FormattedMessage id={`organization.member.edit.dialog.${name}`} />
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

  renderInviteEmailField() {
    const { member, classes, submitting } = this.props

    if (member.user) {
      return null
    }

    if (member.inviteTimestamp) {
      return (
        <React.Fragment>
          <DialogContentText className={classes.inviteText}>
            {this.msg(
              'organization.member.edit.dialog.invitation.text_invited',
              {
                inviteDate: formatDate(member.inviteTimestamp),
                inviteTime: formatTime(member.inviteTimestamp)
              }
            )}
          </DialogContentText>
          {this.renderTextField('inviteEmail', false, false, 'email')}
          <FormControlLabel
            value="reinvite"
            control={
              <Checkbox
                color="primary"
                checked={this.props.data.reinvite === true}
                onChange={this.handleCheckboxChange('reinvite')}
              />
            }
            label={this.msg(
              'organization.member.edit.dialog.invitation.checkbox_reinvite'
            )}
            labelPlacement="end"
            disabled={submitting}
            className={classes.reinviteCheckbox}
          />
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <DialogContentText className={classes.inviteText}>
            {this.msg(
              'organization.member.edit.dialog.invitation.text_not_invited'
            )}
          </DialogContentText>
          {this.renderTextField('inviteEmail', false, false, 'email')}
        </React.Fragment>
      )
    }
  }
}

EditMemberDialog.propTypes = {
  organizationId: PropTypes.string.isRequired,
  member: memberShape.isRequired,
  data: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    nr: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
    inviteEmail: PropTypes.string,
    reinvite: PropTypes.bool
  }).isRequired,
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  submitting: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  intl: intlShape.isRequired
}

export default withStyles(styles)(injectIntl(EditMemberDialog))
