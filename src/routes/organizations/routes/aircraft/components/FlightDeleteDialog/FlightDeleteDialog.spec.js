import React from 'react'
import { renderIntlMaterial } from '../../../../../../testutil/renderIntl'
import FlightDeleteDialog from './FlightDeleteDialog'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('components', () => {
          describe('FlightDeleteDialog', () => {
            it('renders correctly', () => {
              const aircraft = {
                id: 'o7flC7jw8jmkOfWo8oyA',
                registration: 'HBKLA'
              }
              const flight = {
                id: 'sStfyLd2XArT7oUZPFDn',
                departureAerodrome: { name: 'Lommis' },
                destinationAerodrome: { name: 'Lommis' },
                blockOffTime: {
                  toDate: () => Date.parse('2018-11-20 10:00')
                },
                blockOnTime: {
                  toDate: () => Date.parse('2018-11-20 11:10')
                },
                takeOffTime: {
                  toDate: () => Date.parse('2018-11-20 10:10')
                },
                landingTime: {
                  toDate: () => Date.parse('2018-11-20 11:00')
                },
                pilot: {
                  firstname: 'Max',
                  lastname: 'Muster'
                }
              }
              const renderedValue = renderIntlMaterial(
                <FlightDeleteDialog
                  organizationId="my_org"
                  aircraft={aircraft}
                  flight={flight}
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
