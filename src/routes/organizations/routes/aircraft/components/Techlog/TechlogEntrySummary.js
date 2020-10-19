import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import { formatDate, formatTime } from '../../../../../../util/dates'
import { techlogEntry } from '../../../../../../shapes'
import Attachments from './Attachments'
import EntryStatus from './EntryStatus'

const styles = theme => ({
  entryHeading: {
    fontSize: theme.typography.pxToRem(15),
    display: 'block',
    flex: 1
  },
  entryNumber: {
    marginRight: '1em',
    paddingRight: '1em',
    borderRight: `1px solid ${theme.palette.divider}`
  },
  entryNumberText: {
    fontWeight: 'bold'
  },
  entrySecondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    display: 'block'
  }
})

const TechlogEntrySummary = ({
  organizationId,
  aircraftId,
  authToken,
  classes,
  entry: {
    id,
    number,
    description,
    currentStatus,
    timestamp,
    author: { firstname, lastname },
    attachments
  }
}) => (
  <>
    <div className={classes.entryNumber}>
      <Typography
        className={classes.entryNumberText}
      >{`#${number}`}</Typography>
    </div>
    <div className={classes.entryHeading}>
      <Typography paragraph className={classes.description}>
        {description.split('\n').map((line, idx) => (
          <React.Fragment key={idx}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </Typography>
      <Attachments
        organizationId={organizationId}
        aircraftId={aircraftId}
        techlogEntryId={id}
        authToken={authToken}
        attachments={attachments}
      />
      <EntryStatus id={currentStatus} />
    </div>
    <Typography className={classes.entrySecondaryHeading}>
      {firstname} {lastname}, {formatDate(timestamp)} {formatTime(timestamp)}
    </Typography>
  </>
)

TechlogEntrySummary.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  entry: techlogEntry.isRequired,
  authToken: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(TechlogEntrySummary)
