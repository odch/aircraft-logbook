import React from 'react'
import PropTypes from 'prop-types'
import Header from '../../../../../../containers/HeaderContainer'
import OrganizationDetail from '../../containers/OrganizationDetailContainer'

const OrganizationPage = ({ router: { match } }) => (
  <React.Fragment>
    <Header />
    <OrganizationDetail match={match} />
  </React.Fragment>
)

OrganizationPage.propTypes = {
  router: PropTypes.shape({
    match: PropTypes.shape({
      params: PropTypes.object.isRequired
    }).isRequired
  })
}

export default OrganizationPage
