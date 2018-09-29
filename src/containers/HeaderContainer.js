import { connect } from 'react-redux'
import Header from '../components/Header'
import { logout } from '../modules/login'

const mapStateToProps = (state /*, ownProps*/) => ({
  auth: state.firebase.auth
})

const mapActionCreators = {
  logout
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(Header)
