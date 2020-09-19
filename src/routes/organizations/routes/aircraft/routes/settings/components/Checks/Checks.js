import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import Button from '@material-ui/core/Button'
import isLoaded from '../../../../../../../../util/isLoaded'
import LoadingIcon from '../../../../../../../../components/LoadingIcon'
import { check as checkShape } from '../../../../../../../../shapes/aircraft'
import { intl as intlShape } from '../../../../../../../../shapes'
import CreateCheckDialog from '../../containers/CreateCheckDialogContainer'
import DeleteCheckDialog from '../DeleteCheckDialog'
import Check from './Check'

const styles = {
  loadingIconContainer: {
    position: 'relative',
    minHeight: '100px'
  }
}

class Checks extends React.Component {
  handleCreateClick = () => {
    this.props.openCreateCheckDialog()
  }

  componentDidMount() {
    const { organizationId, aircraftId, fetchChecks } = this.props
    fetchChecks(organizationId, aircraftId)
  }

  componentDidUpdate(prevProps) {
    const { organizationId, aircraftId, fetchChecks } = this.props
    if (
      prevProps.organizationId !== organizationId ||
      prevProps.aircraftId !== aircraftId
    ) {
      fetchChecks(organizationId, aircraftId)
    }
  }

  render() {
    const {
      organizationId,
      aircraftId,
      checks,
      createCheckDialogOpen,
      deleteCheckDialog,
      classes,
      deleteCheck,
      openDeleteCheckDialog,
      closeDeleteCheckDialog
    } = this.props

    if (!isLoaded(checks)) {
      return (
        <div className={classes.loadingIconContainer}>
          <LoadingIcon />
        </div>
      )
    }

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
              deleteCheck(
                organizationId,
                aircraftId,
                deleteCheckDialog.check.id
              )
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
  checks: PropTypes.arrayOf(checkShape),
  deleteCheckDialog: PropTypes.shape({
    open: PropTypes.bool,
    submitting: PropTypes.bool,
    check: checkShape
  }).isRequired,
  createCheckDialogOpen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  fetchChecks: PropTypes.func.isRequired,
  openCreateCheckDialog: PropTypes.func.isRequired,
  openDeleteCheckDialog: PropTypes.func.isRequired,
  closeDeleteCheckDialog: PropTypes.func.isRequired,
  deleteCheck: PropTypes.func.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(withStyles(styles)(Checks))
