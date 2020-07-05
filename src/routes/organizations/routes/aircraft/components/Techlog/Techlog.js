import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import TablePagination from '@material-ui/core/TablePagination'
import Divider from '@material-ui/core/Divider'
import TechlogEntryCreateDialog from '../../containers/TechlogEntryCreateDialogContainer'
import TechlogEntryActionCreateDialog from '../../containers/TechlogEntryActionCreateDialogContainer'
import {
  aircraft as aircraftShape,
  techlogEntry as techlogEntryShape,
  organization as organizationShape,
  intl as intlShape
} from '../../../../../../shapes'
import { formatDate, formatTime } from '../../../../../../util/dates'
import isLoaded from '../../../../../../util/isLoaded'
import { isClosed } from '../../../../../../util/techlogStatus'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import TechlogEntryDetails from './TechlogEntryDetail'
import EntryStatus from './EntryStatus'

const styles = theme => ({
  loadingIconContainer: {
    position: 'relative',
    minHeight: '100px'
  },
  container: {
    marginTop: '1em'
  },
  entryHeading: {
    fontSize: theme.typography.pxToRem(15),
    display: 'block',
    flex: 1
  },
  entrySecondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    display: 'block'
  },
  closed: {
    opacity: 0.7,
    fontStyle: 'italic',
    backgroundColor: theme.palette.grey[100]
  }
})

class Techlog extends React.Component {
  state = {
    expanded: null
  }

  componentDidMount() {
    const { organization, aircraft, initTechlog, showOnlyOpen } = this.props
    initTechlog(organization.id, aircraft.id, showOnlyOpen)
  }

  handleCreateClick = () => {
    this.props.openCreateTechlogEntryDialog()
  }

  handleCreateActionClick = (techlogEntryId, status) => () => {
    this.props.openCreateTechlogEntryActionDialog(techlogEntryId, status)
  }

  handleExpansionPanelChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    })
  }

  msg = id => this.props.intl.formatMessage({ id })

  isTechlogManager = () =>
    this.props.organization.roles.includes('techlogmanager')

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
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleCreateClick}
        >
          <FormattedMessage id="aircraftdetail.techlog.create" />
        </Button>
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
              organizationId={organization.id}
              aircraftId={aircraft.id}
            />
          )}
        </div>
      </React.Fragment>
    )
  }

  renderEntries() {
    return this.props.techlog.map(entry => {
      return this.renderEntry(entry)
    })
  }

  renderEntry(entry) {
    const expanded = this.state.expanded === entry.id
    return (
      <ExpansionPanel
        key={entry.id}
        expanded={expanded}
        onChange={this.handleExpansionPanelChange(entry.id)}
      >
        {this.renderSummary(entry)}
        {expanded && this.renderDetails(entry)}
      </ExpansionPanel>
    )
  }

  renderSummary(entry) {
    const { classes } = this.props
    const {
      id,
      description,
      current_status,
      timestamp,
      author: { firstname, lastname }
    } = entry
    return (
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        className={
          isClosed(current_status) && this.state.expanded !== id
            ? classes.closed
            : null
        }
      >
        <div className={classes.entryHeading}>
          <Typography paragraph className={classes.description}>
            {description.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Typography>
          <EntryStatus id={current_status} />
        </div>
        <Typography className={classes.entrySecondaryHeading}>
          {firstname} {lastname}, {formatDate(timestamp)}{' '}
          {formatTime(timestamp)}
        </Typography>
      </ExpansionPanelSummary>
    )
  }

  renderDetails(entry) {
    const { aircraft } = this.props
    return (
      <React.Fragment>
        <ExpansionPanelDetails>
          <TechlogEntryDetails aircraft={aircraft} entry={entry} />
        </ExpansionPanelDetails>
        {this.isTechlogManager() && (
          <React.Fragment>
            <Divider />
            <ExpansionPanelActions>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleCreateActionClick(
                  entry.id,
                  entry.current_status
                )}
              >
                <FormattedMessage id="aircraftdetail.techlog.action.create" />
              </Button>
            </ExpansionPanelActions>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }

  renderNoEntries() {
    return (
      <Typography paragraph>
        <FormattedMessage id="aircraftdetail.techlog.none" />
      </Typography>
    )
  }
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
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  initTechlog: PropTypes.func.isRequired,
  changeTechlogPage: PropTypes.func.isRequired,
  fetchTechlog: PropTypes.func.isRequired,
  openCreateTechlogEntryDialog: PropTypes.func.isRequired,
  openCreateTechlogEntryActionDialog: PropTypes.func.isRequired
}

export default injectIntl(withStyles(styles)(Techlog))
