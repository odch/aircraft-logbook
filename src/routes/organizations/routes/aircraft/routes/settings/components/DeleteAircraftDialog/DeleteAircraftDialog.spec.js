import React from 'react'
import { renderIntlMaterial } from '../../../../../../../../testutil/renderIntl'
import DeleteAircraftDialog from './DeleteAircraftDialog'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('routes', () => {
          describe('settings', () => {
            describe('components', () => {
              describe('OrganizationDeleteDialog', () => {
                it('renders correctly', () => {
                  const renderedValue = renderIntlMaterial(
                    <DeleteAircraftDialog
                      organizationId="my_org"
                      aircraftId="my_aircraft"
                      registration="HB-ABC"
                      open
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
  })
})
