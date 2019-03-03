import React from 'react'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import MomentUtils from '@date-io/moment'
import { renderIntlMaterial } from '../../../../../../testutil/renderIntl'
import FlightCreateDialog from './FlightCreateDialog'

const AIRCRAFT_SETTINGS = {
  fuelTypes: [
    {
      value: 'mogas',
      label: 'MoGas'
    },
    {
      value: 'avgas',
      label: 'AvGas'
    }
  ],
  engineHoursCounterEnabled: true
}

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('components', () => {
          describe('FlightCreateDialog', () => {
            it('renders correctly', () => {
              const data = {
                initialized: true,
                date: '2018-11-30',
                blockOffTime: '2018-11-30 16:00',
                takeOffTime: '2018-11-30 16:10',
                landingTime: '2018-11-30 16:30',
                blockOnTime: '2018-11-30 16:40',
                counters: {
                  flights: { start: 456 }
                }
              }
              const renderedValue = renderIntlMaterial(
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <FlightCreateDialog
                    organizationId="my_org"
                    aircraftId="o7flC7jw8jmkOfWo8oyA"
                    data={data}
                    initialData={data}
                    updateData={() => {}}
                    aircraftSettings={AIRCRAFT_SETTINGS}
                  />
                </MuiPickersUtilsProvider>,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders disabled when submitting', () => {
              const data = {
                initialized: true,
                date: '2018-11-30',
                blockOffTime: '2018-11-30 16:00',
                takeOffTime: '2018-11-30 16:10',
                landingTime: '2018-11-30 16:30',
                blockOnTime: '2018-11-30 16:40',
                counters: {
                  flights: { start: 456 }
                }
              }
              const renderedValue = renderIntlMaterial(
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <FlightCreateDialog
                    organizationId="my_org"
                    aircraftId="o7flC7jw8jmkOfWo8oyA"
                    data={data}
                    initialData={data}
                    submitting
                    updateData={() => {}}
                    aircraftSettings={AIRCRAFT_SETTINGS}
                  />
                </MuiPickersUtilsProvider>,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders readonly fields disabled', () => {
              const data = {
                initialized: true,
                date: '2018-11-30',
                blockOffTime: '2018-11-30 16:00',
                takeOffTime: '2018-11-30 16:10',
                landingTime: '2018-11-30 16:30',
                blockOnTime: '2018-11-30 16:40',
                counters: {
                  flights: { start: 456 }
                }
              }
              const renderedValue = renderIntlMaterial(
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <FlightCreateDialog
                    organizationId="my_org"
                    aircraftId="o7flC7jw8jmkOfWo8oyA"
                    data={data}
                    initialData={data}
                    updateData={() => {}}
                    aircraftSettings={AIRCRAFT_SETTINGS}
                  />
                </MuiPickersUtilsProvider>,
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
