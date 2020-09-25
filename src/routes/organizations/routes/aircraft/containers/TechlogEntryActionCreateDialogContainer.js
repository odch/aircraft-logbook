import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import TechlogEntryActionCreateDialog from '../components/TechlogEntryActionCreateDialog'
import {
  updateCreateTechlogEntryActionDialogData,
  closeCreateTechlogEntryActionDialog,
  createTechlogEntryAction
} from '../module'
import { getTechlogStatus } from '../../../../../util/techlogStatus'
import { aircraftSettings } from '../util/flightDialogUtils'

const statusOption = (intl, statusId) => ({
  value: statusId,
  label: intl.formatMessage({ id: `techlog.entry.status.${statusId}` })
})

const techlogEntryStatus = intl =>
  getTechlogStatus(true).map(status => statusOption(intl, status.id))

const mapStateToProps = (state, ownProps) => {
  const { aircraftId, intl } = ownProps

  const {
    techlogEntryId,
    data,
    submitting
  } = state.aircraft.createTechlogEntryActionDialog

  if (typeof data.status === 'string') {
    data.status = statusOption(intl, data.status)
  }

  return {
    statusOptions: techlogEntryStatus(intl),
    techlogEntryId,
    data,
    submitting,
    aircraftSettings: aircraftSettings(state, aircraftId)
  }
}

const mapActionCreators = {
  updateData: updateCreateTechlogEntryActionDialogData,
  onClose: closeCreateTechlogEntryActionDialog,
  onSubmit: createTechlogEntryAction
}

export default injectIntl(
  compose(connect(mapStateToProps, mapActionCreators))(
    TechlogEntryActionCreateDialog
  )
)
