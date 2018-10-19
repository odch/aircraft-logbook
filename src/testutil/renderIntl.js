import React from 'react'
import renderer from 'react-test-renderer'
import { createMount } from '@material-ui/core/test-utils'
import { IntlProvider } from 'react-intl'
import messages from '../messages'

const LOCALE = 'de'

const renderInIntlProvider = component => (
  <IntlProvider locale={LOCALE} messages={messages[LOCALE]}>
    {component}
  </IntlProvider>
)

const renderIntl = component => renderer.create(renderInIntlProvider(component))

export const renderIntlMaterial = component =>
  createMount()(renderInIntlProvider(component))

export default renderIntl
