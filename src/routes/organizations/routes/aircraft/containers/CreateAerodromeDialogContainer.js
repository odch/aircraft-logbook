import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import CreateAerodromeDialog from '../components/CreateAerodromeDialog'
import {
  closeCreateAerodromeDialog,
  updateCreateAerodromeDialogData,
  createAerodrome
} from '../module'

const mapStateToProps = (state, ownProps) => ({
  organizationId: ownProps.organizationId,
  fieldName: state.aircraft.createAerodromeDialog.fieldName,
  data: state.aircraft.createAerodromeDialog.data,
  submitting: state.aircraft.createAerodromeDialog.submitting
})

const mapActionCreators = {
  onClose: closeCreateAerodromeDialog,
  updateData: updateCreateAerodromeDialogData,
  onSubmit: createAerodrome
}

export default injectIntl(
  compose(
    connect(
      mapStateToProps,
      mapActionCreators
    )
  )(CreateAerodromeDialog)
)
