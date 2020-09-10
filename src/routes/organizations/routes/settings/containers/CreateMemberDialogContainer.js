import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import CreateMemberDialog from '../components/CreateMemberDialog'
import { getMemberRoles } from '../../../../../util/memberRoles'
import {
  closeCreateMemberDialog,
  updateCreateMemberDialogData,
  createMember
} from '../module'

export const roles = intl =>
  getMemberRoles().map(role => ({
    value: role,
    label: intl.formatMessage({ id: `organization.role.${role}` })
  }))

const mapStateToProps = (state, ownProps) => ({
  organizationId: ownProps.organizationId,
  data: state.organizationSettings.createMemberDialog.data,
  roles: roles(ownProps.intl),
  submitting: state.organizationSettings.createMemberDialog.submitting
})

const mapActionCreators = {
  onClose: closeCreateMemberDialog,
  updateData: updateCreateMemberDialogData,
  onSubmit: createMember
}

export default injectIntl(
  compose(connect(mapStateToProps, mapActionCreators))(CreateMemberDialog)
)
