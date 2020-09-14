import React from 'react'
import PropTypes from 'prop-types'
import { IntlProvider } from 'react-intl'
import moment from 'moment-timezone'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import LoadingIcon from './LoadingIcon'
import messages from '../../messages'

class App extends React.Component {
  loadAerodromes = () => {
    const { auth, watchAerodromes } = this.props

    if (auth.isLoaded && !auth.isEmpty) {
      watchAerodromes()
    }
  }

  componentDidMount() {
    moment.locale(this.props.locale)
    this.loadAerodromes()
  }

  componentDidUpdate(prevProps) {
    const { locale } = this.props
    if (locale !== prevProps.locale) {
      moment.locale(locale)
    }

    this.loadAerodromes()
  }

  render() {
    const {
      auth: { isLoaded },
      locale
    } = this.props

    if (!isLoaded) {
      return <LoadingIcon />
    }

    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <MuiPickersUtilsProvider
          libInstance={moment}
          utils={MomentUtils}
          locale={locale}
        >
          {this.props.children}
        </MuiPickersUtilsProvider>
      </IntlProvider>
    )
  }
}

App.propTypes = {
  auth: PropTypes.shape({
    isLoaded: PropTypes.bool.isRequired,
    isEmpty: PropTypes.bool.isRequired
  }).isRequired,
  locale: PropTypes.string.isRequired,
  children: PropTypes.element,
  watchAerodromes: PropTypes.func.isRequired
}

export default App
