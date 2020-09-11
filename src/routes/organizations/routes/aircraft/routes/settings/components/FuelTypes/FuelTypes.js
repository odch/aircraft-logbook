import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import Button from '@material-ui/core/Button'
import { fuelType as fuelTypeShape } from '../../../../../../../../shapes/aircraft'
import CreateFuelTypeDialog from '../../containers/CreateFuelTypeDialogContainer'
import FuelType from './FuelType'
import DeleteFuelTypeDialog from '../DeleteFuelTypeDialog'

class FuelTypes extends React.Component {
  handleCreateClick = () => {
    this.props.openCreateFuelTypeDialog()
  }

  render() {
    const {
      organizationId,
      aircraftId,
      types,
      deleteFuelTypeDialog,
      createFuelTypeDialogOpen,
      openDeleteFuelTypeDialog,
      closeDeleteFuelTypeDialog,
      deleteFuelType
    } = this.props

    return (
      <div>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage id="aircraft.settings.fueltypes" />
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleCreateClick}
        >
          <FormattedMessage id="aircraft.settings.fueltypes.create" />
        </Button>
        {types.length > 0 ? (
          <List dense>
            {types.map(type => (
              <FuelType
                key={type.name}
                fuelType={type}
                openDeleteFuelTypeDialog={openDeleteFuelTypeDialog}
              />
            ))}
          </List>
        ) : (
          <Typography paragraph>
            <FormattedMessage id="aircraft.settings.fueltypes.none" />
          </Typography>
        )}
        {createFuelTypeDialogOpen && (
          <CreateFuelTypeDialog
            organizationId={organizationId}
            aircraftId={aircraftId}
          />
        )}
        {deleteFuelTypeDialog.open && (
          <DeleteFuelTypeDialog
            submitting={deleteFuelTypeDialog.submitting}
            fuelType={deleteFuelTypeDialog.fuelType}
            onConfirm={() =>
              deleteFuelType(
                organizationId,
                aircraftId,
                deleteFuelTypeDialog.fuelType
              )
            }
            onClose={closeDeleteFuelTypeDialog}
          />
        )}
      </div>
    )
  }
}

FuelTypes.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  types: PropTypes.arrayOf(fuelTypeShape).isRequired,
  deleteFuelTypeDialog: PropTypes.shape({
    open: PropTypes.bool,
    submitting: PropTypes.bool,
    fuelType: fuelTypeShape
  }).isRequired,
  createFuelTypeDialogOpen: PropTypes.bool.isRequired,
  openCreateFuelTypeDialog: PropTypes.func.isRequired,
  openDeleteFuelTypeDialog: PropTypes.func.isRequired,
  closeDeleteFuelTypeDialog: PropTypes.func.isRequired,
  deleteFuelType: PropTypes.func.isRequired
}

export default FuelTypes
