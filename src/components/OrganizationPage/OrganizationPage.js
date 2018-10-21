import React from 'react'
import PropTypes from 'prop-types'
import Header from '../../containers/HeaderContainer'
import OrganizationDetail from '../../containers/OrganizationDetailContainer'

const OrganizationPage = ({ match }) => (
  <React.Fragment>
    <Header />
    <OrganizationDetail match={match} />
  </React.Fragment>
)

OrganizationPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object.isRequired
  }).isRequired
}

export default OrganizationPage
