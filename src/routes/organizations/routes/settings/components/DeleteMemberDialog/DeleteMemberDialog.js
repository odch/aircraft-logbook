import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DeleteButton from '../../../../../../components/DeleteButton'
import { member as memberShape } from '../../../../../../shapes'

const MemberAttribute = props => (
  <DialogContentText>
    <FormattedMessage id={`organization.member.delete.dialog.${props.label}`} />
    :&nbsp;
    {props.value}
  </DialogContentText>
)

MemberAttribute.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

const styles = {
  attributesWrapper: {
    marginTop: '1em'
  }
}

class DeleteMemberDialog extends React.Component {
  handleClose = () => {
    if (!this.props.submitting && this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    const { member, submitting, classes, onConfirm } = this.props
    return (
      <Dialog onClose={this.handleClose} data-cy="member-delete-dialog" open>
        <DialogTitle>
          <FormattedMessage id="organization.member.delete.dialog.title" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage id="organization.member.delete.dialog.text" />
          </DialogContentText>
          <div className={classes.attributesWrapper}>
            <MemberAttribute label="firstname" value={member.firstname} />
            <MemberAttribute label="lastname" value={member.lastname} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} disabled={submitting}>
            <FormattedMessage id="organization.member.delete.dialog.buttons.cancel" />
          </Button>
          <DeleteButton
            onClick={onConfirm}
            color="secondary"
            variant="contained"
            label={this.props.intl.formatMessage({
              id: 'organization.member.delete.dialog.buttons.delete'
            })}
            data-cy="member-delete-button"
            disabled={submitting}
            inProgress={submitting}
          />
        </DialogActions>
      </Dialog>
    )
  }
}

DeleteMemberDialog.propTypes = {
  organizationId: PropTypes.string.isRequired,
  member: memberShape.isRequired,
  submitting: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  intl: intlShape
}

export default withStyles(styles)(injectIntl(DeleteMemberDialog))
