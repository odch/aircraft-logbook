import React from 'react'
import { renderIntlMaterial } from '../../../../../../testutil/renderIntl'
import AircraftCreateDialog from './AircraftCreateDialog'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('detail', () => {
        describe('components', () => {
          describe('AircraftCreateDialog', () => {
            it('renders correctly', () => {
              const renderedValue = renderIntlMaterial(
                <AircraftCreateDialog
                  data={{ registration: 'HB-ABC' }}
                  updateData={() => {}}
                />,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })
          })
        })
      })
    })
  })
})
