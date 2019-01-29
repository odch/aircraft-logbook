import React from 'react'
import PropTypes from 'prop-types'
import Header from '../../../../../../../../containers/HeaderContainer'
import AircraftSettings from '../../containers/AircraftSettingsContainer'

const AircraftSettingsPage = ({ router: { match } }) => (
  <React.Fragment>
    <Header />
    <AircraftSettings match={match} />
  </React.Fragment>
)

AircraftSettingsPage.propTypes = {
  router: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.object.isRequired
    }).isRequired
  })
}

export default AircraftSettingsPage
