import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import _get from 'lodash.get'
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
import CorrectionFlightCreateDialog from '../../containers/CorrectionFlightCreateDialogContainer'
import FlightDeleteDialog from '../FlightDeleteDialog'
import {
  aircraft as aircraftShape,
  flight as flightShape,
  organization as organizationShape,
  intl as intlShape
} from '../../../../../../shapes'
import { isBefore } from '../../../../../../util/dates'
import isLoaded from '../../../../../../util/isLoaded'
import LoadingIcon from '../../../../../../components/LoadingIcon'
import FlightSummary from './FlightSummary'
import FlightDetails from './FlightDetails'
import CorrectionFlightDetails from './CorrectionFlightDetails'

const styles = theme => ({
  loadingIconContainer: {
    position: 'relative',
    minHeight: '100px'
  },
  buttonsContainer: {
    '&::after': {
      content: '""',
      clear: 'both',
      display: 'table'
    }
  },
  button: {
    marginBottom: '0.5em',
    marginRight: '1em'
  },
  container: {
    marginTop: '1em'
  },
  deleted: {
    opacity: 0.7,
    fontStyle: 'italic',
    backgroundColor: theme.palette.grey[100]
  },
  showDeletedSwitch: {
    float: 'right'
  },
  flightSummaryContent: {
    flexWrap: 'wrap'
  }
})

class FlightList extends React.Component {
  state = {
    expanded: null
  }

  hasRole = role => this.props.organization.roles.includes(role)

  isOrganizationManager = () => this.hasRole('manager')

  isTechlogManager = () => this.hasRole('techlogmanager')

  isLocked = flight => {
    const lockDate = _get(this.props.aircraft, 'settings.lockDate')
    return (
      lockDate && isBefore(flight.blockOffTime, undefined, lockDate, undefined)
    )
  }

  hasWritePermissions = () => {
    const organization = this.props.organization
    return organization.readonly !== true && organization.expired !== true
  }

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
    const {
      organization,
      aircraft,
      newestFlight,
      openCreateFlightDialog,
      initCreateFlightDialog,
      openEditFlightDialog
    } = this.props
    if (this.newestFlightIsPreflight()) {
      openEditFlightDialog(organization.id, aircraft.id, newestFlight.id)
    } else {
      openCreateFlightDialog()
      initCreateFlightDialog(organization.id, aircraft.id)
    }
  }

  handleCreateCorrectionClick = () => {
    const { organization, aircraft } = this.props
    this.props.openCreateCorrectionFlightDialog(organization.id, aircraft.id)
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

  newestFlightIsPreflight = () => {
    const newestFlight = this.props.newestFlight
    return newestFlight && newestFlight.version === 0
  }

  render() {
    const {
      organization,
      aircraft,
      flights,
      createFlightDialogOpen,
      createCorrectionFlightDialogOpen,
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
        <div className={classes.buttonsContainer}>
          {this.hasWritePermissions() && (
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleCreateClick}
              className={classes.button}
              data-cy="flight-create-button"
            >
              <FormattedMessage
                id={
                  this.newestFlightIsPreflight()
                    ? 'aircraftdetail.completeflight'
                    : 'aircraftdetail.createflight'
                }
              />
            </Button>
          )}
          {this.hasWritePermissions() &&
            this.isTechlogManager() &&
            flights.length > 0 &&
            !this.newestFlightIsPreflight() && (
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleCreateCorrectionClick}
                className={classes.button}
              >
                <FormattedMessage id="aircraftdetail.createcorrectionflight" />
              </Button>
            )}
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
        </div>
        <div className={classes.container} data-cy="flights-container">
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
          {createCorrectionFlightDialogOpen && (
            <CorrectionFlightCreateDialog
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
        data-cy={flight.version === 0 ? 'preflight-panel' : 'flight-panel'}
      >
        {this.renderSummary(flight)}
        {expanded === flight.id && this.renderDetails(flight, isNewestFlight)}
      </ExpansionPanel>
    )
  }

  renderSummary(flight) {
    return (
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        classes={{
          content: this.props.classes.flightSummaryContent
        }}
      >
        <FlightSummary flight={flight} showDeleted={this.props.showDeleted} />
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
    const isLocked = this.isLocked(flight)
    return (
      <>
        <ExpansionPanelDetails key={`details-${flight.id}`}>
          {flight.correction === true ? (
            <CorrectionFlightDetails aircraft={aircraft} flight={flight} />
          ) : (
            <FlightDetails aircraft={aircraft} flight={flight} />
          )}
        </ExpansionPanelDetails>
        {this.hasWritePermissions() && flight.deleted === false && (
          <>
            <Divider key={`divider-${flight.id}`} />
            <ExpansionPanelActions key={`actions-${flight.id}`}>
              {flight.correction !== true && (
                <Tooltip
                  title={this.msg(
                    isLocked
                      ? 'flightlist.edit.locked'
                      : flight.version === 0
                      ? 'flightlist.edit.preflight'
                      : 'flightlist.edit'
                  )}
                >
                  {/* span required to render tooltip for button */}
                  <span>
                    <IconButton
                      onClick={() =>
                        openEditFlightDialog(
                          organization.id,
                          aircraft.id,
                          flight.id
                        )
                      }
                      disabled={isLocked}
                    >
                      <EditIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              <Tooltip
                title={this.msg(
                  !isNewestFlight
                    ? 'flightlist.delete.not_newest'
                    : isLocked
                    ? 'flightlist.delete.locked'
                    : 'flightlist.delete'
                )}
              >
                {/* span required to render tooltip for button */}
                <span>
                  <IconButton
                    onClick={() => openDeleteFlightDialog(flight)}
                    disabled={isLocked || !isNewestFlight}
                    data-cy="flight-delete-button"
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
  newestFlight: flightShape,
  createFlightDialogOpen: PropTypes.bool.isRequired,
  createCorrectionFlightDialogOpen: PropTypes.bool.isRequired,
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
  openCreateCorrectionFlightDialog: PropTypes.func.isRequired,
  openEditFlightDialog: PropTypes.func.isRequired,
  openDeleteFlightDialog: PropTypes.func.isRequired,
  closeDeleteFlightDialog: PropTypes.func.isRequired,
  deleteFlight: PropTypes.func.isRequired,
  changeFlightsPage: PropTypes.func
}

export default injectIntl(withStyles(styles)(FlightList))
