import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { formatDate, formatTime } from '../../../../../../util/dates'
import StatusTransition from './StatusTransition'
import { FormattedMessage } from 'react-intl'
import Attachments from './Attachments'

const styles = theme => ({
  actionContainer: {
    display: 'flex',
    marginBottom: '1em'
  },
  actionDescriptionContainer: {
    flex: 1,
    paddingRight: '1em'
  },
  metaInfo: {
    color: theme.palette.text.secondary
  },
  actionDivider: {
    margin: '1em 0'
  },
  signature: {
    fontStyle: 'italic'
  }
})

const Action = ({
  organizationId,
  aircraftId,
  techlogEntryId,
  action: {
    id,
    description,
    status,
    author,
    timestamp,
    signature,
    attachments
  },
  isFirst,
  isLast,
  statusBefore,
  authToken,
  classes
}) => (
  <React.Fragment key={id}>
    {isFirst && <Divider className={classes.actionDivider} />}
    <div className={classes.actionContainer}>
      <div className={classes.actionDescriptionContainer}>
        <Typography paragraph className={classes.description}>
          {description.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </Typography>
        {signature && (
          <Typography paragraph className={classes.signature}>
            <FormattedMessage id="aircraftdetail.techlog.action.signature" />
            :&nbsp;{signature}
          </Typography>
        )}
        <Attachments
          organizationId={organizationId}
          aircraftId={aircraftId}
          techlogEntryId={techlogEntryId}
          techlogEntryActionId={id}
          authToken={authToken}
          attachments={attachments}
        />
      </div>
      <Typography paragraph className={classes.metaInfo}>
        {author.firstname} {author.lastname}, {formatDate(timestamp)}{' '}
        {formatTime(timestamp)}
      </Typography>
    </div>
    {statusBefore !== status && (
      <StatusTransition before={statusBefore} after={status} />
    )}
    {!isLast && <Divider className={classes.actionDivider} />}
  </React.Fragment>
)

Action.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  techlogEntryId: PropTypes.string.isRequired,
  action: PropTypes.object.isRequired,
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  statusBefore: PropTypes.string.isRequired,
  authToken: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Action)
