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
import DeleteButton from '../../../../../../components/DeleteButton'

class OrganizationDeleteDialog extends React.Component {
  state = {
    id: ''
  }

  handleExited = () => {
    this.setState({
      id: ''
    })
  }

  handleIdChange = e => {
    this.setState({
      id: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.props.onConfirm) {
      this.props.onConfirm()
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        onExited={this.handleExited}
      >
        <DialogTitle>
          <FormattedMessage id="organizations.delete.dialog.title" />
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent>
            <DialogContentText>
              <FormattedMessage id="organizations.delete.dialog.text" />
              &nbsp;
              <strong>{this.props.organizationId}</strong>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              placeholder={this.props.intl.formatMessage({
                id: 'organizations.delete.dialog.id'
              })}
              type="text"
              fullWidth
              required
              value={this.state.id}
              onChange={this.handleIdChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose}>
              <FormattedMessage id="organizations.delete.dialog.buttons.cancel" />
            </Button>
            <DeleteButton
              type="submit"
              color="secondary"
              variant="contained"
              disabled={this.state.id !== this.props.organizationId}
              label={this.props.intl.formatMessage({
                id: 'organizations.delete.dialog.buttons.delete'
              })}
            />
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

OrganizationDeleteDialog.propTypes = {
  organizationId: PropTypes.string.isRequired,
  open: PropTypes.bool,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  intl: intlShape
}

export default injectIntl(OrganizationDeleteDialog)
