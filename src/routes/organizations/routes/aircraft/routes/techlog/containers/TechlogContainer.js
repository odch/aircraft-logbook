import { compose } from 'redux'
import { connect } from 'react-redux'
import Techlog from '../../../components/Techlog'
import {
  getAircraftTechlog,
  getAircraft
} from '../../../../../../../util/getFromState'
import {
  initTechlog,
  changeTechlogPage,
  fetchTechlog,
  openCreateTechlogEntryDialog,
  openCreateTechlogEntryActionDialog
} from '../../../module'

const mapStateToProps = (state, ownProps) => {
  const { organization, aircraft } = ownProps

  const techlog = getAircraftTechlog(
    state,
    aircraft.id,
    state.aircraft.techlog.page
  )

  const pagination = aircraft
    ? {
        rowsCount: getAircraft(state, aircraft.id).counters.techlogEntries,
        page: state.aircraft.techlog.page,
        rowsPerPage: state.aircraft.techlog.rowsPerPage
      }
    : undefined

  return {
    organization,
    aircraft,
    techlog,
    pagination,
    createTechlogEntryDialogOpen: state.aircraft.createTechlogEntryDialog.open,
    createTechlogEntryActionDialogOpen:
      state.aircraft.createTechlogEntryActionDialog.open
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
