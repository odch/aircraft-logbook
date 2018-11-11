import React from 'react'
import PropTypes from 'prop-types'
import Header from '../../../../../../containers/HeaderContainer'
import OrganizationSettings from '../../containers/OrganizationSettingsContainer'

const OrganizationSettingsPage = ({ router: { match } }) => (
  <React.Fragment>
    <Header />
    <OrganizationSettings match={match} />
  </React.Fragment>
)

OrganizationSettingsPage.propTypes = {
  router: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.object.isRequired
    }).isRequired
  })
}

export default OrganizationSettingsPage
