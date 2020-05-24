import { compose } from 'redux'
import { connect } from 'react-redux'
import _get from 'lodash.get'
import Checks from '../components/Checks'
import { getAircraft } from '../../../../../../../util/getFromState'
import { openCreateCheckDialog } from '../module'

const mapStateToProps = (state, ownProps) => {
  const { organizationId, aircraftId } = ownProps

  const aircraft = getAircraft(state, aircraftId)
  const checks = _get(aircraft, 'checks', [])

  return {
    organizationId,
    aircraftId,
    checks,
    createCheckDialogOpen: state.aircraftSettings.createCheckDialog.open
  }
}

const mapActionCreators = {
  openCreateCheckDialog
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(Checks)
