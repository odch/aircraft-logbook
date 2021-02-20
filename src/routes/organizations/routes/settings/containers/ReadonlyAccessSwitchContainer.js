import { compose } from 'redux'
import { connect } from 'react-redux'
import { setReadonlyAccessEnabled } from '../module'
import ReadonlyAccessSwitch from '../components/ReadonlyAccessSwitch'

const mapStateToProps = state => ({
  submitting: state.organizationSettings.readonlyAccessSwitch.submitting
})

const mapActionCreators = {
  setEnabled: setReadonlyAccessEnabled
}

export default compose(connect(mapStateToProps, mapActionCreators))(
  ReadonlyAccessSwitch
)
