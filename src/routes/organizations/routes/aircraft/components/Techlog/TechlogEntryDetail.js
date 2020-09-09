import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import withStyles from '@material-ui/core/styles/withStyles'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import { techlogEntry } from '../../../../../../shapes'
import EntryAction from './EntryAction'

const styles = {
  loadingIconContainer: {
    position: 'relative',
    width: '100%',
    minHeight: '50px'
  },
  actionsContainer: {
    width: '100%',
    paddingLeft: '1em'
  },
  actionDivider: {
    margin: '1em 0'
  }
}

const TechlogEntryDetail = ({
  organizationId,
  aircraftId,
  entry,
  authToken,
  classes
}) => {
  if (!entry.actions) {
    return (
      <div className={classes.loadingIconContainer}>
        <LoadingIcon />
      </div>
    )
  }

  if (entry.actions.length === 0) {
    return (
      <div className={classes.actionsContainer}>
        <Divider className={classes.actionDivider} />
        <Typography paragraph>
          <FormattedMessage id="aircraftdetail.techlog.action.none" />
        </Typography>
      </div>
    )
  }

  return (
    <div className={classes.actionsContainer}>
      {entry.actions.map((action, index) => {
        const isFirst = index === 0
        const isLast = index === entry.actions.length - 1
        const statusBefore = isFirst
          ? entry.initialStatus
          : entry.actions[index - 1].status
        return (
          <EntryAction
            organizationId={organizationId}
            aircraftId={aircraftId}
            techlogEntryId={entry.id}
            action={action}
            key={action.id}
            isFirst={isFirst}
            isLast={isLast}
            statusBefore={statusBefore}
            authToken={authToken}
          />
        )
      })}
    </div>
  )
}

TechlogEntryDetail.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  entry: techlogEntry.isRequired,
  authToken: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(TechlogEntryDetail)
