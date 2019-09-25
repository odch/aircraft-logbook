import { compose } from 'redux'
import { connect } from 'react-redux'
import { exportFlights } from '../module'
import ExportFlightsForm from '../components/ExportFlightsForm'
import { getOrganization } from '../../../../../util/getFromState'

const mapStateToProps = (state, ownProps) => {
  return {
    organization: getOrganization(state, ownProps.organizationId),
    submitting: state.organizationSettings.exportFlightsForm.submitting
  }
}

const mapActionCreators = {
  exportFlights
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(ExportFlightsForm)
