import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import { intl as intlShape } from '../../../../shapes'

const styles = {
  loadingIndicator: {
    marginRight: 5
  }
}

class OrganizationsCreateDialog extends React.Component {
  handleNameChange = e => {
    this.props.updateData({
      name: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.props.onSubmit) {
      this.props.onSubmit(this.props.data)
    }
  }

  handleClose = () => {
    if (!this.props.submitted && this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    const { data, open, submitted, classes, onClose } = this.props
    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        data-cy="organization-create-dialog"
      >
        <DialogTitle>
          <FormattedMessage id="organizations.create.dialog.title" />
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent>
            <DialogContentText>
              <FormattedMessage id="organizations.create.dialog.text" />
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={this.props.intl.formatMessage({
                id: 'organizations.create.dialog.name'
              })}
              type="text"
              fullWidth
              required
              value={data.name}
              onChange={this.handleNameChange}
              data-cy="name-field"
              disabled={submitted}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary" disabled={submitted}>
              <FormattedMessage id="organizations.create.dialog.buttons.cancel" />
            </Button>
            <Button
              type="submit"
              color="primary"
              data-cy="create-button"
              disabled={submitted}
            >
              {submitted && (
                <CircularProgress
                  size={16}
                  className={classes.loadingIndicator}
                />
              )}
              <FormattedMessage id="organizations.create.dialog.buttons.create" />
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

OrganizationsCreateDialog.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  open: PropTypes.bool,
  submitted: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  intl: intlShape
}

export default withStyles(styles)(injectIntl(OrganizationsCreateDialog))
