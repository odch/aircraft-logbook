import React from 'react'
import { renderIntlMaterial } from '../../testutil/renderIntl'
import IntegerField from './IntegerField'

describe('components', () => {
  describe('IntegerField', () => {
    it('renders correctly', () => {
      const renderedValue = renderIntlMaterial(
        <IntegerField
          label="test field"
          value={3}
          margin="normal"
          fullWidth
          cy="test-field"
        />,
        true
      )
      expect(renderedValue).toMatchSnapshot()
    })

    it('renders in error mode', () => {
      const renderedValue = renderIntlMaterial(
        <IntegerField
          label="test field"
          value={3}
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
        <IntegerField
          label="test field"
          value={3}
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
