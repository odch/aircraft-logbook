import { compose } from 'redux'
import { connect } from 'react-redux'
import { updateLockDate } from '../module'
import LockDateForm from '../components/LockDateForm'
import { getOrganization } from '../../../../../util/getFromState'

const mapStateToProps = (state, ownProps) => {
  const organization = getOrganization(state, ownProps.organizationId)
  return {
    submitting: state.organizationSettings.lockDateForm.submitting,
    date: organization.lockDate ? organization.lockDate.toDate() : null
  }
}

const mapActionCreators = {
  updateDate: updateLockDate
}

export default compose(connect(mapStateToProps, mapActionCreators))(
  LockDateForm
)
