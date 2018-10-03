import React from 'react'
import renderer from 'react-test-renderer'
import { IntlProvider } from 'react-intl'
import messages from '../messages'

const LOCALE = 'de'

const renderIntl = component =>
  renderer.create(
    <IntlProvider locale={LOCALE} messages={messages[LOCALE]}>
      {component}
    </IntlProvider>
  )

export default renderIntl
