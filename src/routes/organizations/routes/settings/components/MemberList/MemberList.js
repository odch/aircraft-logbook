import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import {
  member as memberShape,
  organization as organizationShape
} from '../../../../../../shapes'
import isLoaded from '../../../../../../util/isLoaded'
import LoadingIcon from '../../../../../../components/LoadingIcon'

class MemberList extends React.Component {
  componentDidMount() {
    const { organization, fetchMembers } = this.props
    fetchMembers(organization.id)
  }

  getRoleNames = roles =>
    roles
      ? roles.map(role => this.msg(`organization.role.${role}`)).join(', ')
      : ''

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const { members } = this.props

    if (!isLoaded(members)) {
      return <LoadingIcon />
    }

    return (
      <List>
        {members.map(member => (
          <ListItem key={member.id} disableGutters>
            <ListItemText
              primary={`${member.lastname} ${member.firstname}`}
              secondary={this.getRoleNames(member.roles)}
            />
          </ListItem>
        ))}
      </List>
    )
  }
}

MemberList.propTypes = {
  organization: organizationShape.isRequired,
  members: PropTypes.arrayOf(memberShape),
  fetchMembers: PropTypes.func.isRequired,
  intl: intlShape.isRequired
}

export default injectIntl(MemberList)
