import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import { check as checkShape } from '../../../../../../../../shapes/aircraft'
import { formatDate } from '../../../../../../../../util/dates'
import { intl as intlShape } from '../../../../../../../../shapes'
import CreateCheckDialog from '../../containers/CreateCheckDialogContainer'

class Checks extends React.Component {
  handleCreateClick = () => {
    this.props.openCreateCheckDialog()
  }

  getCheckText = check => {
    const textParts = []

    if (check.dateLimit) {
      textParts.push(formatDate(check.dateLimit))
    }
    if (check.counterLimit) {
      textParts.push(
        `${check.counterLimit} ${this.props.intl.formatMessage({
          id: `aircraft.counter.${check.counterReference.toLowerCase()}`
        })}`
      )
    }

    return textParts.join(' / ')
  }

  render() {
    const {
      organizationId,
      aircraftId,
      checks,
      createCheckDialogOpen
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
          this.renderList(checks)
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
      </div>
    )
  }

  renderList = checks => (
    <List dense>
      {checks.map(check => (
        <ListItem key={check.description} disableGutters>
          <ListItemText
            primary={check.description}
            secondary={this.getCheckText(check)}
          />
        </ListItem>
      ))}
    </List>
  )
}

Checks.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  checks: PropTypes.arrayOf(checkShape).isRequired,
  createCheckDialogOpen: PropTypes.bool.isRequired,
  openCreateCheckDialog: PropTypes.func.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(Checks)
