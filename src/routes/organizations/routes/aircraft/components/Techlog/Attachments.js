import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import AttachmentIcon from '@material-ui/icons/Attachment'
import DownloadIcon from '@material-ui/icons/GetApp'
import humanFileSize from '../../../../../../util/humanFileSize'
import download from '../../../../../../util/download'
import { attachmentShape } from '../../../../../../shapes/techlogEntry'

const styles = {
  container: {
    marginBottom: '1em'
  },
  attachmentIcon: {
    verticalAlign: 'middle',
    height: '0.85em'
  },
  attachmentText: {
    fontSize: '0.85em'
  },
  downloadButton: {
    marginLeft: '0.3em'
  },
  downloadIcon: {
    height: '0.85em'
  }
}

const getLink = (organizationId, aircraftId, techlogEntryId, name) =>
  `https://us-central1-${__CONF__.firebase.projectId}.cloudfunctions.net/api/techlog-attachment?organization=${organizationId}&aircraft=${aircraftId}&techlogEntry=${techlogEntryId}&name=${name}`

const handleDownloadClick = (
  organizationId,
  aircraftId,
  techlogEntryId,
  name,
  authToken,
  originalName
) => async e => {
  e.stopPropagation() // don't open/collapse panel
  const url = getLink(organizationId, aircraftId, techlogEntryId, name)
  await download(url, authToken, originalName)
}

const Attachments = ({
  organizationId,
  aircraftId,
  techlogEntryId,
  authToken,
  attachments,
  classes
}) =>
  !attachments || attachments.length === 0 ? null : (
    <div className={classes.container}>
      {attachments.map(attachment => (
        <div key={attachment.name}>
          <AttachmentIcon className={classes.attachmentIcon} />
          <span className={classes.attachmentText}>
            {attachment.originalName} ({humanFileSize(attachment.size)})
          </span>
          <IconButton
            className={classes.downloadButton}
            size="small"
            onClick={handleDownloadClick(
              organizationId,
              aircraftId,
              techlogEntryId,
              attachment.name,
              authToken,
              attachment.originalName
            )}
          >
            <DownloadIcon className={classes.download} />
          </IconButton>
        </div>
      ))}
    </div>
  )

Attachments.propTypes = {
  organizationId: PropTypes.string.isRequired,
  aircraftId: PropTypes.string.isRequired,
  techlogEntryId: PropTypes.string.isRequired,
  authToken: PropTypes.string.isRequired,
  attachments: PropTypes.arrayOf(attachmentShape),
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Attachments)
