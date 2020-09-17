import React from 'react'
import { renderIntlMaterial } from '../../testutil/renderIntl'
import DecimalField from './DecimalField'

describe('components', () => {
  describe('DecimalField', () => {
    it('renders correctly (2 fraction digits by default)', () => {
      const renderedValue = renderIntlMaterial(
        <DecimalField
          label="test field"
          value={484478} // = 4844 hours and 78 hundredths of an hour
          margin="normal"
          fullWidth
          cy="test-field"
        />,
        true
      )
      expect(renderedValue).toMatchSnapshot()
    })

    it('renders correctly with 1 fraction digit', () => {
      const renderedValue = renderIntlMaterial(
        <DecimalField
          label="test field"
          value={484470} // = 4844 hours and 70 hundredths of an hour
          margin="normal"
          fullWidth
          cy="test-field"
          fractionDigits={1}
        />,
        true
      )
      expect(renderedValue).toMatchSnapshot()
    })

    it('renders in error mode', () => {
      const renderedValue = renderIntlMaterial(
        <DecimalField
          label="test field"
          value={484478} // = 4844 hours and 78 hundredths of an hour
          margin="normal"
          fullWidth
          cy="test-field"
          error
        />,
        true
      )
      expect(renderedValue).toMatchSnapshot()
    })

    it('renders disabled', () => {
      const renderedValue = renderIntlMaterial(
        <DecimalField
          label="test field"
          value={484478} // = 4844 hours and 78 hundredths of an hour
          margin="normal"
          fullWidth
          cy="test-field"
          disabled
        />,
        true
      )
      expect(renderedValue).toMatchSnapshot()
    })
  })
})
