import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import {
  organization as organizationShape,
  techlogEntry as techlogEntryShape
} from '../../../../../../shapes'
import { TechlogEntry } from '../Techlog'

const LatestCrs = ({ organization, aircraftId, crs, authToken }) => {
  const [expanded, setExpanded] = useState(false)

  if (!crs) {
    return <FormattedMessage id="aircraftdetail.latestcrs.none" />
  }

  return (
    <TechlogEntry
      expanded={expanded}
      organization={organization}
      aircraftId={aircraftId}
      entry={crs}
      authToken={authToken}
      markIfClosed={false}
      onExpansionChange={setExpanded}
    />
  )
}

LatestCrs.propTypes = {
  organization: organizationShape.isRequired,
  aircraftId: PropTypes.string.isRequired,
  crs: techlogEntryShape,
  authToken: PropTypes.string.isRequired
}

export default LatestCrs
