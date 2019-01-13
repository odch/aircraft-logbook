import React from 'react'
import { Redirect } from 'react-router-dom'
import LoadingIcon from '../../../../components/LoadingIcon'
import { organization } from '../../../../shapes'
import isLoaded from '../../../../util/isLoaded'

class StartPage extends React.Component {
  render() {
    const { selectedOrganization } = this.props
    if (!isLoaded(selectedOrganization)) {
      return <LoadingIcon />
    }
    if (selectedOrganization) {
      return <Redirect to={`/organizations/${selectedOrganization.id}`} />
    }
    return <Redirect to="/organizations" />
  }
}

StartPage.propTypes = {
  selectedOrganization: organization
}

export default StartPage
