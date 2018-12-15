import React from 'react'
import { renderIntlMaterial } from '../../testutil/renderIntl'
import HoursCounterField from './HoursCounterField'

describe('components', () => {
  describe('HoursCounterField', () => {
    it('renders correctly', () => {
      const renderedValue = renderIntlMaterial(
        <HoursCounterField
          label="test field"
          value={484478} // = 4844 hours and 78 hundredths of an hour
          margin="normal"
          fullWidth
          cy="hours-counter-field"
        />,
        true
      )
      expect(renderedValue).toMatchSnapshot()
    })
  })
})
