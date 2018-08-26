import { connect } from 'react-redux'
import Title from '../components/Title'

const mapStateToProps = (state /*, ownProps*/) => ({
  text: state.title
})

const mapDispatchToProps = (/*dispatch, ownProps*/) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Title)
