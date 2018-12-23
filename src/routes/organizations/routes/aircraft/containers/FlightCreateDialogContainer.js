import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { getFlightNatures } from '../../../../../util/flightNatures'
import FlightCreateDialog from '../components/FlightCreateDialog'
import {
  closeCreateFlightDialog,
  updateCreateFlightDialogData,
  createFlight
} from '../module'

const mapStateToProps = (state, ownProps) => {
  return {
    organizationMembers: state.firestore.ordered.organizationMembers,
    flightNatures: getFlightNatures().map(nature => ({
      value: nature,
      label: ownProps.intl.formatMessage({ id: `flight.nature.${nature}` })
    })),
    aerodromes: state.firestore.ordered.aerodromes,
    data: state.aircraft.createFlightDialogData
  }
}

const mapActionCreators = {
  onClose: closeCreateFlightDialog,
  updateData: updateCreateFlightDialogData,
  onSubmit: createFlight
}

export default injectIntl(
  compose(
    connect(
      mapStateToProps,
      mapActionCreators
    )
  )(FlightCreateDialog)
)
