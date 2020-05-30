import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import classNames from 'classnames'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import withStyles from '@material-ui/core/styles/withStyles'
import { intl as intlShape } from '../../../../../../shapes'
import {
  check as checkShape,
  counters as countersShape
} from '../../../../../../shapes/aircraft'
import {
  formatDate,
  humanDurationUntilDate
} from '../../../../../../util/dates'

const styles = theme => ({
  due: {
    color: theme.palette.error.dark
  },
  description: {
    fontWeight: 'bold',
    marginBottom: '0.5em'
  },
  text: {
    marginBottom: '0.2em'
  },
  diff: {
    fontSize: '0.9em',
    fontStyle: 'italic'
  },
  diffNotDue: {
    color: theme.palette.grey[700]
  }
})

class Check extends React.Component {
  msg = (id, values) => this.props.intl.formatMessage({ id }, values)

  getDiff = (limit, currentValue, counterName) => {
    if (['flightHours', 'engineHours'].includes(counterName)) {
      currentValue = Math.round(currentValue / 100) // hours are stored in hundreths of an hour
    }
    return limit - currentValue
  }

  getCheckText = (check, counters) => {
    const textParts = []
    const diffParts = []
    let due = false

    if (check.dateLimit) {
      textParts.push(
        this.msg('aircraftdetail.checks.date.text', {
          date: formatDate(check.dateLimit)
        })
      )

      const diff = humanDurationUntilDate(check.dateLimit)

      const msgId = diff.past
        ? 'aircraftdetail.checks.date.due'
        : 'aircraftdetail.checks.date.remaining'

      diffParts.push(this.msg(msgId, { diff: diff.text }))

      if (diff.past) {
        due = true
      }
    }

    if (check.counterLimit) {
      const counterName = this.msg(
        `aircraft.counter.${check.counterReference.toLowerCase()}`
      )

      textParts.push(
        this.msg('aircraftdetail.checks.counter.text', {
          limit: `${check.counterLimit} ${counterName}`
        })
      )

      const diff = this.getDiff(
        check.counterLimit,
        counters[check.counterReference] || 0,
        check.counterReference
      )

      const msgId =
        diff < 0
          ? 'aircraftdetail.checks.counter.due'
          : 'aircraftdetail.checks.counter.remaining'

      diffParts.push(this.msg(msgId, { diff: Math.abs(diff), counterName }))

      if (diff < 0) {
        due = true
      }
    }

    return {
      text: textParts.join(' / '),
      diff: diffParts.join(' / '),
      due
    }
  }

  render() {
    const { check, counters, classes } = this.props

    const checkText = this.getCheckText(check, counters)

    return (
      <Card className={checkText.due ? classes.due : undefined}>
        <CardContent>
          <div className={classes.description}>{check.description}</div>
          <div className={classes.text}>{checkText.text}</div>
          <div
            className={classNames(
              classes.diff,
              !checkText.due && classes.diffNotDue
            )}
          >
            {checkText.diff}
          </div>
        </CardContent>
      </Card>
    )
  }
}

Check.propTypes = {
  check: checkShape.isRequired,
  counters: countersShape.isRequired,
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(injectIntl(Check))
