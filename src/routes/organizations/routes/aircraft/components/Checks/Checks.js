import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { intl as intlShape } from '../../../../../../shapes'
import {
  check as checkShape,
  counters as countersShape
} from '../../../../../../shapes/aircraft'
import Check from './Check'

const styles = {
  container: {
    marginBottom: '1em'
  }
}

class Checks extends React.Component {
  render() {
    const { checks, counters, classes } = this.props

    if (!checks || checks.length === 0) {
      return null
    }

    return (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage id="aircraftdetail.checks" />
        </Typography>
        <Grid container spacing={3} className={classes.container}>
          {checks.map((check, index) => (
            <Grid item key={index} sm={4} xs={12}>
              <Check check={check} counters={counters} />
            </Grid>
          ))}
        </Grid>
      </React.Fragment>
    )
  }
}

Checks.propTypes = {
  checks: PropTypes.arrayOf(checkShape),
  counters: countersShape,
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(injectIntl(Checks))
