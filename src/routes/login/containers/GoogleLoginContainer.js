import { connect } from 'react-redux'
import GoogleLogin from '../components/GoogleLogin'
import { loginGoogle } from '../module'

const mapStateToProps = (state /*, ownProps*/) => ({
  googleLogin: state.login.googleLogin
})

const mapActionCreators = {
  loginGoogle
}

export default connect(mapStateToProps, mapActionCreators)(GoogleLogin)
