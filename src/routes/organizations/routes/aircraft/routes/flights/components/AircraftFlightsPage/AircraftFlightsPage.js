import React from 'react'
import Header from '../../../../../../../../containers/HeaderContainer'
import AircraftFlights from '../../containers/AircraftFlightsContainer'
import PropTypes from 'prop-types'

const AircraftFlightsPage = ({ router: { match } }) => (
  <React.Fragment>
    <Header />
    <AircraftFlights match={match} />
  </React.Fragment>
)

AircraftFlightsPage.propTypes = {
  router: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.object.isRequired
    }).isRequired
  })
}

export default AircraftFlightsPage
