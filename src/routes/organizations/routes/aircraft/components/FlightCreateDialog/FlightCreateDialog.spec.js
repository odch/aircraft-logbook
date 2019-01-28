import React from 'react'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import MomentUtils from '@date-io/moment'
import { renderIntlMaterial } from '../../../../../../testutil/renderIntl'
import FlightCreateDialog from './FlightCreateDialog'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('components', () => {
          describe('FlightCreateDialog', () => {
            it('renders correctly', () => {
              const renderedValue = renderIntlMaterial(
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <FlightCreateDialog
                    organizationId="my_org"
                    aircraftId="o7flC7jw8jmkOfWo8oyA"
                    data={{
                      initialized: true,
                      date: '2018-11-30',
                      blockOffTime: '2018-11-30 16:00',
                      takeOffTime: '2018-11-30 16:10',
                      landingTime: '2018-11-30 16:30',
                      blockOnTime: '2018-11-30 16:40'
                    }}
                    updateData={() => {}}
                  />
                </MuiPickersUtilsProvider>,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders disabled when submitting', () => {
              const renderedValue = renderIntlMaterial(
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <FlightCreateDialog
                    organizationId="my_org"
                    aircraftId="o7flC7jw8jmkOfWo8oyA"
                    data={{
                      initialized: true,
                      date: '2018-11-30',
                      blockOffTime: '2018-11-30 16:00',
                      takeOffTime: '2018-11-30 16:10',
                      landingTime: '2018-11-30 16:30',
                      blockOnTime: '2018-11-30 16:40'
                    }}
                    submitting
                    updateData={() => {}}
                  />
                </MuiPickersUtilsProvider>,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders readonly fields disabled', () => {
              const renderedValue = renderIntlMaterial(
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <FlightCreateDialog
                    organizationId="my_org"
                    aircraftId="o7flC7jw8jmkOfWo8oyA"
                    data={{
                      initialized: true,
                      date: '2018-11-30',
                      blockOffTime: '2018-11-30 16:00',
                      takeOffTime: '2018-11-30 16:10',
                      landingTime: '2018-11-30 16:30',
                      blockOnTime: '2018-11-30 16:40'
                    }}
                    readOnlyFields={['date', 'blockOffTime']}
                    updateData={() => {}}
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
