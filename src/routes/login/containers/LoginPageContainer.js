import { connect } from 'react-redux'
import LoginPage from '../components/LoginPage'
import { loginWithToken } from '../module'

const mapStateToProps = (state /*, ownProps*/) => ({
  auth: state.firebase.auth,
  tokenLogin: state.login.tokenLogin
})

const mapActionCreators = {
  loginWithToken
}

export default connect(mapStateToProps, mapActionCreators)(LoginPage)
