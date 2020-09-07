import { connect } from 'react-redux'
import LoginPage from '../components/LoginPage'

const mapStateToProps = (state /*, ownProps*/) => ({
  auth: state.firebase.auth
})

const mapDispatchToProps = (/*dispatch, ownProps*/) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
