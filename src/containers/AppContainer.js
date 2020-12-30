import { connect } from 'react-redux'
import _get from 'lodash.get'
import App from '../components/App'
import { watchAerodromes } from '../modules/app'

const DEFAULT_AUTH = { isLoaded: false, isEmpty: true }
export const DEFAULT_LOCALE = 'en'

const mapStateToProps = (state /*, ownProps*/) => ({
  auth: state.firebase ? state.firebase.auth : DEFAULT_AUTH,
  locale: _get(state, 'firestore.data.currentUser.locale', DEFAULT_LOCALE)
})

const mapActionCreators = {
  watchAerodromes
}

export default connect(mapStateToProps, mapActionCreators)(App)
