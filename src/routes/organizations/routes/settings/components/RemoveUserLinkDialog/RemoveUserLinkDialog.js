import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import SaveButton from '../../../../../../components/SaveButton'
import {
  member as memberShape,
  intl as intlShape
} from '../../../../../../shapes'

const MemberAttribute = props => (
  <DialogContentText className={props.className}>
    <FormattedMessage
      id={`organization.member.removeuserlink.dialog.${props.label}`}
    />
    :&nbsp;
    {props.value}
  </DialogContentText>
)

MemberAttribute.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string
}

const styles = {
  attributesWrapper: {
    marginTop: '1em'
  },
  attribute: {
    margin: 1
  }
}

class RemoveUserLinkDialog extends React.Component {
  handleClose = () => {
    if (!this.props.submitting && this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    const { member, submitting, classes, onConfirm } = this.props
    return (
      <Dialog
        onClose={this.handleClose}
        data-cy="remove-member-link-dialog"
        open
      >
        <DialogTitle>
          <FormattedMessage id="organization.member.removeuserlink.dialog.title" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage id="organization.member.removeuserlink.dialog.text" />
          </DialogContentText>
          <div className={classes.attributesWrapper}>
            {member.firstname && (
              <MemberAttribute
                label="firstname"
                value={member.firstname}
                className={classes.attribute}
              />
            )}
            {member.lastname && (
              <MemberAttribute
                label="lastname"
                value={member.lastname}
                className={classes.attribute}
              />
            )}
            {member.nr && (
              <MemberAttribute
                label="nr"
                value={member.nr}
                className={classes.attribute}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} disabled={submitting}>
            <FormattedMessage id="organization.member.removeuserlink.dialog.buttons.cancel" />
          </Button>
          <SaveButton
            onClick={onConfirm}
            color="secondary"
            variant="contained"
            label={this.props.intl.formatMessage({
              id:
                'organization.member.removeuserlink.dialog.buttons.removeuserlink'
            })}
            data-cy="remove-user-link-button"
            disabled={submitting}
            inProgress={submitting}
          />
        </DialogActions>
      </Dialog>
    )
  }
}

RemoveUserLinkDialog.propTypes = {
  organizationId: PropTypes.string.isRequired,
  member: memberShape.isRequired,
  submitting: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  intl: intlShape
}

export default withStyles(styles)(injectIntl(RemoveUserLinkDialog))
