import React from 'react'
import { FormattedMessage } from 'react-intl'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { fuelTypes as fuelTypesShape } from '../../../../../../../../shapes/aircraft'

class FuelTypes extends React.Component {
  render() {
    const { types } = this.props

    return (
      <div>
        <Typography variant="title" gutterBottom>
          <FormattedMessage id="aircraft.settings.fueltypes" />
        </Typography>
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
      </div>
    )
  }
}

FuelTypes.propTypes = {
  types: fuelTypesShape.isRequired
}

export default FuelTypes
