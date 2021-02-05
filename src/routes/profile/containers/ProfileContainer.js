import { connect } from 'react-redux'
import Profile from '../components/Profile'

const mapStateToProps = (state /*, ownProps*/) => ({
  user: state.firestore.data.currentUser
})

const mapActionCreators = {}

export default connect(mapStateToProps, mapActionCreators)(Profile)
