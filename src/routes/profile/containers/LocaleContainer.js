import { connect } from 'react-redux'
import _get from 'lodash.get'
import { DEFAULT_LOCALE } from '../../../containers/AppContainer'
import Locale from '../components/Locale'
import { updateLocale } from '../module'

const mapStateToProps = (state /*, ownProps*/) => ({
  locale: _get(state, 'firestore.data.currentUser.locale', DEFAULT_LOCALE)
})

const mapActionCreators = {
  updateLocale
}

export default connect(mapStateToProps, mapActionCreators)(Locale)
