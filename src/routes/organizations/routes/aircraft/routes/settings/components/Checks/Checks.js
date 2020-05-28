import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import Button from '@material-ui/core/Button'
import { check as checkShape } from '../../../../../../../../shapes/aircraft'
import { intl as intlShape } from '../../../../../../../../shapes'
import CreateCheckDialog from '../../containers/CreateCheckDialogContainer'
import DeleteCheckDialog from '../DeleteCheckDialog'
import Check from './Check'

class Checks extends React.Component {
  handleCreateClick = () => {
    this.props.openCreateCheckDialog()
  }

  render() {
    const {
      organizationId,
      aircraftId,
      checks,
      createCheckDialogOpen,
      deleteCheckDialog,
      deleteCheck,
      openDeleteCheckDialog,
      closeDeleteCheckDialog
    } = this.props

    return (
      <div>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage id="aircraft.settings.checks" />
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleCreateClick}
        >
          <FormattedMessage id="aircraft.settings.checks.create" />
        </Button>
        {checks.length > 0 ? (
          this.renderList(checks, openDeleteCheckDialog)
        ) : (
          <Typography paragraph>
            <FormattedMessage id="aircraft.settings.checks.none" />
          </Typography>
        )}
        {createCheckDialogOpen && (
          <CreateCheckDialog
            organizationId={organizationId}
            aircraftId={aircraftId}
          />
        )}
        {deleteCheckDialog.open && (
          <DeleteCheckDialog
            submitting={deleteCheckDialog.submitting}
            check={deleteCheckDialog.check}
            onConfirm={() =>
              deleteCheck(organizationId, aircraftId, deleteCheckDialog.check)
            }
            onClose={closeDeleteCheckDialog}
          />
        )}
      </div>
    )
  }

  renderList = (checks, openDeleteCheckDialog) => (
    <List dense>
      {checks.map((check, index) => (
        <Check
          key={index}
          check={check}
          openDeleteCheckDialog={openDeleteCheckDialog}
        />
      ))}
    </List>
  )
}

Checks.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  checks: PropTypes.arrayOf(checkShape).isRequired,
  deleteCheckDialog: PropTypes.shape({
    open: PropTypes.bool,
    submitting: PropTypes.bool,
    check: checkShape
  }).isRequired,
  createCheckDialogOpen: PropTypes.bool.isRequired,
  openCreateCheckDialog: PropTypes.func.isRequired,
  openDeleteCheckDialog: PropTypes.func.isRequired,
  closeDeleteCheckDialog: PropTypes.func.isRequired,
  deleteCheck: PropTypes.func.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(Checks)
