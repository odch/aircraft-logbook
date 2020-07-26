import { compose } from 'redux'
import { connect } from 'react-redux'
import Techlog from '../components/Techlog'
import { getAircraftTechlogOpen } from '../../../../../util/getFromState'
import {
  initTechlog,
  changeTechlogPage,
  fetchTechlog,
  openCreateTechlogEntryDialog,
  openCreateTechlogEntryActionDialog
} from '../module'

const mapStateToProps = (state, ownProps) => {
  const { organization, aircraft } = ownProps

  const techlog = getAircraftTechlogOpen(state, aircraft.id)

  return {
    organization,
    aircraft,
    techlog,
    createTechlogEntryDialogOpen: state.aircraft.createTechlogEntryDialog.open,
    createTechlogEntryActionDialogOpen:
      state.aircraft.createTechlogEntryActionDialog.open,
    authToken: state.firebase.auth.stsTokenManager.accessToken
  }
}

const mapActionCreators = {
  initTechlog,
  changeTechlogPage,
  fetchTechlog,
  openCreateTechlogEntryDialog,
  openCreateTechlogEntryActionDialog
}

export default compose(
  connect(
    mapStateToProps,
    mapActionCreators
  )
)(Techlog)
