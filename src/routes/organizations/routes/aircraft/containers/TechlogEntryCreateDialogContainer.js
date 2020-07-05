import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import TechlogEntryCreateDialog from '../components/TechlogEntryCreateDialog'
import {
  updateCreateTechlogEntryDialogData,
  closeCreateTechlogEntryDialog,
  createTechlogEntry
} from '../module'
import { getTechlogStatus } from '../../../../../util/techlogStatus'

const isTechlogManager = organization =>
  organization.roles.includes('techlogmanager')

const techlogEntryStatus = (organization, intl) =>
  getTechlogStatus(isTechlogManager(organization)).map(status => ({
    value: status.id,
    label: intl.formatMessage({ id: `techlog.entry.status.${status.id}` })
  }))

const mapStateToProps = (state, ownProps) => {
  const { organization, intl } = ownProps
  const { data, submitting } = state.aircraft.createTechlogEntryDialog
  return {
    statusOptions: techlogEntryStatus(organization, intl),
    data,
    submitting
  }
}

const mapActionCreators = {
  updateData: updateCreateTechlogEntryDialogData,
  onClose: closeCreateTechlogEntryDialog,
  onSubmit: createTechlogEntry
}

export default injectIntl(
  compose(
    connect(
      mapStateToProps,
      mapActionCreators
    )
  )(TechlogEntryCreateDialog)
)
