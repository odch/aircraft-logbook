import React from 'react'
import { renderIntlMaterial } from '../../../../../../testutil/renderIntl'
import FlightDeleteDialog from './FlightDeleteDialog'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('components', () => {
          describe('FlightDeleteDialog', () => {
            const aircraft = {
              id: 'o7flC7jw8jmkOfWo8oyA',
              registration: 'HBKLA'
            }
            const flight = {
              id: 'sStfyLd2XArT7oUZPFDn',
              departureAerodrome: {
                name: 'Lommis',
                timezone: 'Europe/Zurich'
              },
              destinationAerodrome: {
                name: 'Lommis',
                timezone: 'Europe/Zurich'
              },
              blockOffTime: {
                toDate: () => Date.parse('2018-11-20 10:00 GMT+0100')
              },
              blockOnTime: {
                toDate: () => Date.parse('2018-11-20 11:10 GMT+0100')
              },
              takeOffTime: {
                toDate: () => Date.parse('2018-11-20 10:10 GMT+0100')
              },
              landingTime: {
                toDate: () => Date.parse('2018-11-20 11:00 GMT+0100')
              },
              pilot: {
                firstname: 'Max',
                lastname: 'Muster'
              }
            }

            it('renders correctly', () => {
              const renderedValue = renderIntlMaterial(
                <FlightDeleteDialog
                  organizationId="my_org"
                  aircraft={aircraft}
                  flight={{ ...flight, version: 1 }}
                />,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders correctly for preflight record', () => {
              const renderedValue = renderIntlMaterial(
                <FlightDeleteDialog
                  organizationId="my_org"
                  aircraft={aircraft}
                  flight={{ ...flight, version: 0 }}
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
