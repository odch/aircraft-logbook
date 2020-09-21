import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import withStyles from '@material-ui/core/styles/withStyles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import TablePagination from '@material-ui/core/TablePagination'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import Divider from '@material-ui/core/Divider'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FlightCreateDialog from '../../containers/FlightCreateDialogContainer'
import FlightDeleteDialog from '../FlightDeleteDialog'
import {
  aircraft as aircraftShape,
  flight as flightShape,
  organization as organizationShape,
  intl as intlShape
} from '../../../../../../shapes'
import { formatDate, formatTime } from '../../../../../../util/dates'
import isLoaded from '../../../../../../util/isLoaded'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import FlightDetails from './FlightDetails'
import DeletionStatus from './DeletionStatus'
import Version from './Version'

const styles = theme => ({
  loadingIconContainer: {
    position: 'relative',
    minHeight: '100px'
  },
  container: {
    marginTop: '1em'
  },
  flightHeading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '50%',
    flexShrink: 0
  },
  flightSecondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  bold: {
    fontWeight: 'bold'
  },
  deleted: {
    opacity: 0.7,
    fontStyle: 'italic',
    backgroundColor: theme.palette.grey[100]
  },
  showDeletedSwitch: {
    float: 'right'
  },
  deletionStatus: {
    marginRight: '0.5em'
  }
})

class FlightList extends React.Component {
  state = {
    expanded: null
  }

  isOrganizationManager = () =>
    this.props.organization.roles.includes('manager')

  componentDidMount() {
    const {
      organization,
      aircraft,
      initFlightsList,
      rowsPerPage,
      showDeleted
    } = this.props
    initFlightsList(organization.id, aircraft.id, rowsPerPage, showDeleted)
  }

  handleCreateClick = () => {
    const { organization, aircraft } = this.props
    this.props.openCreateFlightDialog()
    this.props.initCreateFlightDialog(organization.id, aircraft.id)
  }

  handleShowDeletedChange = e => {
    const { organization, aircraft, initFlightsList, rowsPerPage } = this.props
    initFlightsList(organization.id, aircraft.id, rowsPerPage, e.target.checked)
  }

  handleExpansionPanelChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    })
  }

  msg = id => this.props.intl.formatMessage({ id })

  render() {
    const {
      organization,
      aircraft,
      flights,
      createFlightDialogOpen,
      flightDeleteDialog,
      rowsPerPage,
      pagination,
      hidePagination,
      hideDeletedSwitch,
      showDeleted,
      classes,
      closeDeleteFlightDialog,
      deleteFlight,
      changeFlightsPage
    } = this.props

    if (!isLoaded(flights)) {
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
          <FormattedMessage id="aircraftdetail.createflight" />
        </Button>
        {hideDeletedSwitch !== true && this.isOrganizationManager() && (
          <FormControlLabel
            control={
              <Switch
                onChange={this.handleShowDeletedChange}
                checked={showDeleted}
              />
            }
            labelPlacement="start"
            label={this.msg('flightlist.showdeleted')}
            className={classes.showDeletedSwitch}
          />
        )}
        <div className={classes.container}>
          {flights.length > 0 ? this.renderFlights() : this.renderNoFlights()}
          {!hidePagination && flights.length > 0 && (
            <TablePagination
              component="div"
              count={pagination.rowsCount}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[]}
              page={pagination.page}
              onChangePage={(event, page) => changeFlightsPage(page)}
            />
          )}
          {createFlightDialogOpen && (
            <FlightCreateDialog
              organizationId={organization.id}
              aircraftId={aircraft.id}
            />
          )}
          {flightDeleteDialog.open && (
            <FlightDeleteDialog
              organizationId={organization.id}
              aircraft={aircraft}
              flight={flightDeleteDialog.flight}
              submitted={flightDeleteDialog.submitted}
              onConfirm={() =>
                deleteFlight(
                  organization.id,
                  aircraft.id,
                  flightDeleteDialog.flight.id
                )
              }
              onClose={closeDeleteFlightDialog}
            />
          )}
        </div>
      </React.Fragment>
    )
  }

  renderFlights() {
    const { flights, pagination } = this.props
    return flights.map((flight, index) => {
      const isNewestFlight = index === 0 && pagination.page === 0
      return this.renderFlight(flight, isNewestFlight)
    })
  }

  renderFlight(flight, isNewestFlight) {
    const { expanded } = this.state
    return (
      <ExpansionPanel
        key={flight.id}
        expanded={expanded === flight.id}
        onChange={this.handleExpansionPanelChange(flight.id)}
        data-id={flight.id}
        className={flight.deleted === true ? this.props.classes.deleted : null}
      >
        {this.renderSummary(flight)}
        {expanded === flight.id && this.renderDetails(flight, isNewestFlight)}
      </ExpansionPanel>
    )
  }

  renderSummary(flight) {
    const { showDeleted, classes } = this.props
    return (
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <div className={classes.flightHeading}>
          <Typography>
            <FormattedMessage
              id="flightlist.flight.heading"
              values={{
                departureAerodrome: (
                  <span className={classes.bold}>
                    {flight.departureAerodrome.identification}
                  </span>
                ),
                destinationAerodrome: (
                  <span className={classes.bold}>
                    {flight.destinationAerodrome.identification}
                  </span>
                ),
                firstname: flight.pilot.firstname,
                lastname: flight.pilot.lastname
              }}
            />
          </Typography>
          {flight.deleted === true && (
            <DeletionStatus
              flight={flight}
              className={classes.deletionStatus}
            />
          )}
          {showDeleted && (flight.replacedWith || flight.version > 1) && (
            <Version flight={flight} />
          )}
        </div>
        <Typography className={classes.flightSecondaryHeading}>
          {formatDate(flight.blockOffTime, flight.departureAerodrome.timezone)},{' '}
          {formatTime(flight.blockOffTime, flight.departureAerodrome.timezone)}-
          {formatTime(flight.blockOnTime, flight.destinationAerodrome.timezone)}
        </Typography>
      </ExpansionPanelSummary>
    )
  }

  renderDetails(flight, isNewestFlight) {
    const {
      organization,
      aircraft,
      openEditFlightDialog,
      openDeleteFlightDialog
    } = this.props
    return (
      <>
        <ExpansionPanelDetails key={`details-${flight.id}`}>
          <FlightDetails aircraft={aircraft} flight={flight} />
        </ExpansionPanelDetails>
        {flight.deleted === false && (
          <>
            <Divider key={`divider-${flight.id}`} />
            <ExpansionPanelActions key={`actions-${flight.id}`}>
              <IconButton
                onClick={() =>
                  openEditFlightDialog(organization.id, aircraft.id, flight.id)
                }
              >
                <EditIcon />
              </IconButton>
              <Tooltip
                title={this.msg(
                  isNewestFlight
                    ? 'flightlist.delete'
                    : 'flightlist.delete.not_newest'
                )}
              >
                {/*  span required to render tooltip for disabled button */}
                <span>
                  <IconButton
                    onClick={() => openDeleteFlightDialog(flight)}
                    disabled={!isNewestFlight}
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </ExpansionPanelActions>
          </>
        )}
      </>
    )
  }

  renderNoFlights() {
    return (
      <Typography paragraph>
        <FormattedMessage id="aircraftdetail.noflights" />
      </Typography>
    )
  }
}

FlightList.defaultProps = {
  rowsPerPage: 10
}

FlightList.propTypes = {
  organization: organizationShape.isRequired,
  aircraft: aircraftShape.isRequired,
  flights: PropTypes.arrayOf(flightShape),
  createFlightDialogOpen: PropTypes.bool.isRequired,
  flightDeleteDialog: PropTypes.shape({
    open: PropTypes.bool,
    submitted: PropTypes.bool,
    flight: flightShape
  }),
  rowsPerPage: PropTypes.number,
  pagination: PropTypes.shape({
    rowsCount: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired
  }).isRequired,
  hidePagination: PropTypes.bool,
  hideDeletedSwitch: PropTypes.bool,
  showDeleted: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  initFlightsList: PropTypes.func.isRequired,
  openCreateFlightDialog: PropTypes.func.isRequired,
  initCreateFlightDialog: PropTypes.func.isRequired,
  openEditFlightDialog: PropTypes.func.isRequired,
  openDeleteFlightDialog: PropTypes.func.isRequired,
  closeDeleteFlightDialog: PropTypes.func.isRequired,
  deleteFlight: PropTypes.func.isRequired,
  changeFlightsPage: PropTypes.func
}

export default injectIntl(withStyles(styles)(FlightList))
