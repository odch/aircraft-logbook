import React from 'react'
import PropTypes from 'prop-types'
import Header from '../../../../../../containers/HeaderContainer'
import AircraftDetail from '../../containers/AircraftDetailContainer'

const AircraftPage = ({ router: { match } }) => (
  <React.Fragment>
    <Header />
    <AircraftDetail match={match} />
  </React.Fragment>
)

AircraftPage.propTypes = {
  router: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.object.isRequired
    }).isRequired
  })
}

export default AircraftPage
