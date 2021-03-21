import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TablePagination from '@material-ui/core/TablePagination'
import TechlogEntryCreateDialog from '../../containers/TechlogEntryCreateDialogContainer'
import TechlogEntryActionCreateDialog from '../../containers/TechlogEntryActionCreateDialogContainer'
import {
  aircraft as aircraftShape,
  techlogEntry as techlogEntryShape,
  organization as organizationShape,
  intl as intlShape
} from '../../../../../../shapes'
import isLoaded from '../../../../../../util/isLoaded'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import TechlogEntry from './TechlogEntry'

const styles = {
  loadingIconContainer: {
    position: 'relative',
    minHeight: '100px'
  },
  container: {
    marginTop: '1em'
  }
}

class Techlog extends React.Component {
  state = {
    expanded: null
  }

  hasWritePermissions = () => {
    const organization = this.props.organization
    return organization.readonly !== true && organization.expired !== true
  }

  componentDidMount() {
    const { organization, aircraft, initTechlog, showOnlyOpen } = this.props
    initTechlog(organization.id, aircraft.id, showOnlyOpen)
  }

  handleCreateClick = () => {
    this.props.openCreateTechlogEntryDialog()
  }

  handleExpansionChange = entryId => expanded => {
    this.setState({
      expanded: expanded ? entryId : false
    })
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const {
      organization,
      aircraft,
      techlog,
      createTechlogEntryDialogOpen,
      createTechlogEntryActionDialogOpen,
      pagination,
      classes,
      changeTechlogPage
    } = this.props

    if (!isLoaded(techlog)) {
      return (
        <div className={classes.loadingIconContainer}>
          <LoadingIcon />
        </div>
      )
    }

    return (
      <React.Fragment>
        {this.hasWritePermissions() && (
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleCreateClick}
          >
            <FormattedMessage id="aircraftdetail.techlog.create" />
          </Button>
        )}
        <div className={classes.container}>
          {techlog.length > 0 ? this.renderEntries() : this.renderNoEntries()}
          {techlog.length > 0 && pagination && (
            <TablePagination
              component="div"
              count={pagination.rowsCount}
              rowsPerPage={pagination.rowsPerPage}
              rowsPerPageOptions={[]}
              page={pagination.page}
              onChangePage={(event, page) => changeTechlogPage(page)}
            />
          )}
          {createTechlogEntryDialogOpen && (
            <TechlogEntryCreateDialog
              organization={organization}
              aircraftId={aircraft.id}
            />
          )}
          {createTechlogEntryActionDialogOpen && (
            <TechlogEntryActionCreateDialog
              organization={organization}
              aircraftId={aircraft.id}
            />
          )}
        </div>
      </React.Fragment>
    )
  }

  renderEntries = () => {
    const {
      techlog,
      organization,
      aircraft,
      authToken,
      openCreateTechlogEntryActionDialog
    } = this.props
    return techlog.map(entry => (
      <TechlogEntry
        key={entry.id}
        organization={organization}
        aircraftId={aircraft.id}
        entry={entry}
        authToken={authToken}
        expanded={this.state.expanded === entry.id}
        onExpansionChange={this.handleExpansionChange(entry.id)}
        onCreateActionClick={openCreateTechlogEntryActionDialog}
      />
    ))
  }

  renderNoEntries = () => (
    <Typography paragraph>
      <FormattedMessage id="aircraftdetail.techlog.none" />
    </Typography>
  )
}

Techlog.defaultProps = {
  rowsPerPage: 10
}

Techlog.propTypes = {
  organization: organizationShape.isRequired,
  aircraft: aircraftShape.isRequired,
  techlog: PropTypes.arrayOf(techlogEntryShape),
  createTechlogEntryDialogOpen: PropTypes.bool.isRequired,
  createTechlogEntryActionDialogOpen: PropTypes.bool.isRequired,
  pagination: PropTypes.shape({
    rowsCount: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number
  }),
  showOnlyOpen: PropTypes.bool,
  authToken: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  initTechlog: PropTypes.func.isRequired,
  changeTechlogPage: PropTypes.func.isRequired,
  fetchTechlog: PropTypes.func.isRequired,
  openCreateTechlogEntryDialog: PropTypes.func.isRequired,
  openCreateTechlogEntryActionDialog: PropTypes.func.isRequired
}

export default injectIntl(withStyles(styles)(Techlog))
