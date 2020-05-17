import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import { fuelTypes as fuelTypesShape } from '../../../../../../../../shapes/aircraft'
import CreateFuelTypeDialog from '../../containers/CreateFuelTypeDialogContainer'

class FuelTypes extends React.Component {
  handleCreateClick = () => {
    this.props.openCreateFuelTypeDialog()
  }

  render() {
    const {
      organizationId,
      aircraftId,
      types,
      createFuelTypeDialogOpen
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
              <ListItem key={type.name} disableGutters>
                <ListItemText
                  primary={type.description}
                  secondary={type.name}
                />
              </ListItem>
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
      </div>
    )
  }
}

FuelTypes.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  types: fuelTypesShape.isRequired,
  createFuelTypeDialogOpen: PropTypes.bool.isRequired,
  openCreateFuelTypeDialog: PropTypes.func.isRequired
}

export default FuelTypes
