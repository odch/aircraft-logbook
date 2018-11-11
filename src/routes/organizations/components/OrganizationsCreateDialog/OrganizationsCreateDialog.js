import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

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

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
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
              value={this.props.data.name}
              onChange={this.handleNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} color="primary">
              <FormattedMessage id="organizations.create.dialog.buttons.cancel" />
            </Button>
            <Button type="submit" color="primary">
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
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  updateData: PropTypes.func.isRequired,
  intl: intlShape
}

export default injectIntl(OrganizationsCreateDialog)
