import React from 'react'
import Header from '../../../../../../../../containers/HeaderContainer'
import AircraftTechlog from '../../containers/AircraftTechlogContainer'
import PropTypes from 'prop-types'

const AircraftTechlogPage = ({ router: { match } }) => (
  <React.Fragment>
    <Header />
    <AircraftTechlog match={match} />
  </React.Fragment>
)

AircraftTechlogPage.propTypes = {
  router: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.object.isRequired
    }).isRequired
  })
}

export default AircraftTechlogPage
