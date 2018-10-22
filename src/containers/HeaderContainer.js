import { connect } from 'react-redux'
import Header from '../components/Header'

const mapStateToProps = (state /*, ownProps*/) => ({
  auth: state.firebase.auth
})

const mapActionCreators = {}

export default connect(
  mapStateToProps,
  mapActionCreators
)(Header)
