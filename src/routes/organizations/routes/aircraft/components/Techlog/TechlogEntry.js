import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import withStyles from '@material-ui/core/styles/withStyles'
import Divider from '@material-ui/core/Divider'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import Button from '@material-ui/core/Button'
import {
  organization as organizationShape,
  techlogEntry as techlogEntryShape
} from '../../../../../../shapes'
import { isClosed } from '../../../../../../util/techlogStatus'
import TechlogEntrySummary from './TechlogEntrySummary'
import TechlogEntryDetails from './TechlogEntryDetail'

const styles = theme => ({
  closed: {
    opacity: 0.7,
    fontStyle: 'italic',
    backgroundColor: theme.palette.grey[100]
  }
})

const hasRole = (organization, role) => organization.roles.includes(role)

const isTechlogManager = organization => hasRole(organization, 'techlogmanager')

const isOrganizationManager = organization => hasRole(organization, 'manager')

const hasActionCreatePermission = (organization, entry) =>
  isTechlogManager(organization) ||
  (isOrganizationManager(organization) &&
    entry.currentStatus === 'for_information_only')

const TechlogEntry = ({
  expanded,
  organization,
  aircraftId,
  entry,
  authToken,
  markIfClosed,
  classes,
  onExpansionChange,
  onCreateActionClick
}) => (
  <ExpansionPanel
    expanded={expanded}
    onChange={(event, expanded) => onExpansionChange(expanded)}
  >
    <ExpansionPanelSummary
      expandIcon={<ExpandMoreIcon />}
      className={
        markIfClosed && isClosed(entry.currentStatus) && !expanded
          ? classes.closed
          : null
      }
    >
      <TechlogEntrySummary
        organizationId={organization.id}
        aircraftId={aircraftId}
        entry={entry}
        authToken={authToken}
      />
    </ExpansionPanelSummary>
    {expanded && (
      <React.Fragment>
        <ExpansionPanelDetails>
          <TechlogEntryDetails
            organizationId={organization.id}
            aircraftId={aircraftId}
            entry={entry}
            authToken={authToken}
          />
        </ExpansionPanelDetails>
        {onCreateActionClick && hasActionCreatePermission(organization, entry) && (
          <React.Fragment>
            <Divider />
            <ExpansionPanelActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  onCreateActionClick(entry.id, entry.currentStatus)
                }}
              >
                <FormattedMessage id="aircraftdetail.techlog.action.create" />
              </Button>
            </ExpansionPanelActions>
          </React.Fragment>
        )}
      </React.Fragment>
    )}
  </ExpansionPanel>
)

TechlogEntry.defaultProps = {
  markIfClosed: true
}

TechlogEntry.propTypes = {
  expanded: PropTypes.bool,
  organization: organizationShape.isRequired,
  aircraftId: PropTypes.string.isRequired,
  entry: techlogEntryShape.isRequired,
  authToken: PropTypes.string.isRequired,
  markIfClosed: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onExpansionChange: PropTypes.func.isRequired,
  onCreateActionClick: PropTypes.func
}

export default withStyles(styles)(TechlogEntry)
