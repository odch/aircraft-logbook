import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import { intl as intlShape } from '../../../../../../../../shapes'

const styles = {
  root: { overflow: 'visible' },
  loadingIndicator: {
    marginRight: 5
  }
}

class CreateFuelTypeDialog extends React.Component {
  handleTextChange = name => e => {
    this.updateData(name, e.target.value)
  }

  handleNameChange = e => {
    this.updateData(
      'name',
      e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    )
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
    const {
      onSubmit,
      organizationId,
      aircraftId,
      data,
      submitting
    } = this.props

    e.preventDefault()
    if (submitting !== true && onSubmit) {
      onSubmit(organizationId, aircraftId, data)
    }
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const { submitting, classes } = this.props
    return (
      <Dialog
        classes={{ paperScrollPaper: classes.root }}
        onClose={this.handleClose}
        data-cy="fueltype-create-dialog"
        open
      >
        <DialogTitle>
          <FormattedMessage id="aircraft.settings.fueltype.create.dialog.title" />
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent className={classes.root}>
            {this.renderTextField('name', true, true, this.handleNameChange)}
            {this.renderTextField('description', false, true)}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} disabled={submitting}>
              <FormattedMessage id="aircraft.settings.fueltype.create.dialog.buttons.cancel" />
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
              <FormattedMessage id="aircraft.settings.fueltype.create.dialog.buttons.create" />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }

  renderTextField(
    name,
    autoFocus,
    required,
    onChange = this.handleTextChange(name)
  ) {
    return (
      <TextField
        label={this.msg(`aircraft.settings.fueltype.create.dialog.${name}`)}
        type="text"
        fullWidth
        required={required}
        value={this.props.data[name]}
        onChange={onChange}
        data-cy={`${name}-field`}
        disabled={this.props.submitting}
        autoFocus={autoFocus}
      />
    )
  }
}

CreateFuelTypeDialog.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  submitting: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  intl: intlShape,
  classes: PropTypes.object.isRequired
}

export default injectIntl(withStyles(styles)(CreateFuelTypeDialog))
