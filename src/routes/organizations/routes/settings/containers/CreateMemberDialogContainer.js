import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import CreateMemberDialog from '../components/CreateMemberDialog'
import {
  closeCreateMemberDialog,
  updateCreateMemberDialogData,
  createMember
} from '../module'

const mapStateToProps = (state, ownProps) => ({
  organizationId: ownProps.organizationId,
  data: state.organizationSettings.createMemberDialog.data,
  submitting: state.organizationSettings.createMemberDialog.submitting
})

const mapActionCreators = {
  onClose: closeCreateMemberDialog,
  updateData: updateCreateMemberDialogData,
  onSubmit: createMember
}

export default injectIntl(
  compose(
    connect(
      mapStateToProps,
      mapActionCreators
    )
  )(CreateMemberDialog)
)
