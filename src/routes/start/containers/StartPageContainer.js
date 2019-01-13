import { connect } from 'react-redux'
import StartPage from '../components/StartPage'
import { getOrganization } from '../../../util/getFromState'

const getSelectedOrganization = state => {
  if (state.firebase.profile.isLoaded !== true) {
    return undefined
  }
  const orgId = state.firebase.profile.selectedOrganization
  return orgId ? getOrganization(state, orgId) : null
}

const mapStateToProps = (state /*, ownProps*/) => ({
  selectedOrganization: getSelectedOrganization(state)
})

const mapActionCreators = {}

export default connect(
  mapStateToProps,
  mapActionCreators
)(StartPage)
