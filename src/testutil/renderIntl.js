import React from 'react'
import renderer from 'react-test-renderer'
import { createMount } from '@material-ui/core/test-utils'
import { IntlProvider } from 'react-intl'
import pretty from 'pretty'
import messages from '../messages'

const LOCALE = 'de'

const renderInIntlProvider = component => (
  <IntlProvider locale={LOCALE} messages={messages[LOCALE]}>
    {component}
  </IntlProvider>
)

const renderIntl = (component, options) =>
  renderer.create(renderInIntlProvider(component), options)

export const renderIntlUpdate = (renderer, component, options) =>
  renderer.update(renderInIntlProvider(component), options)

export const renderIntlMaterial = (component, returnPrettyHtml = false) => {
  const rendered = createMount()(renderInIntlProvider(component))
  return returnPrettyHtml ? pretty(rendered.html()) : rendered
}

export default renderIntl
