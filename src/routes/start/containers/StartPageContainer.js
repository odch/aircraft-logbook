import { connect } from 'react-redux'
import StartPage from '../components/StartPage'
import { getOrganization } from '../../../util/getFromState'

const getSelectedOrganization = state => {
  const currentUser = state.firestore.data.currentUser

  // not yet loaded
  if (!currentUser) {
    return undefined
  }

  return currentUser.selectedOrganization
    ? getOrganization(state, currentUser.selectedOrganization)
    : null
}

const mapStateToProps = (state /*, ownProps*/) => ({
  selectedOrganization: getSelectedOrganization(state)
})

const mapActionCreators = {}

export default connect(
  mapStateToProps,
  mapActionCreators
)(StartPage)
