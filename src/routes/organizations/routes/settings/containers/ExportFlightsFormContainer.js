import { compose } from 'redux'
import { connect } from 'react-redux'
import { exportFlights, updateExportFlightsFormData } from '../module'
import ExportFlightsForm from '../components/ExportFlightsForm'
import { getOrganization } from '../../../../../util/getFromState'

const mapStateToProps = (state, ownProps) => {
  return {
    organization: getOrganization(state, ownProps.organizationId),
    submitting: state.organizationSettings.exportFlightsForm.submitting,
    data: state.organizationSettings.exportFlightsForm.data
  }
}

const mapActionCreators = {
  exportFlights,
  updateData: updateExportFlightsFormData
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(ExportFlightsForm)
