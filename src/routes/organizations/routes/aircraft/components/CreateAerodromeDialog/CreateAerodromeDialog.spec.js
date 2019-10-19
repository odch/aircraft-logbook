import React from 'react'
import { renderIntlMaterial } from '../../../../../../testutil/renderIntl'
import CreateAerodromeDialog from './CreateAerodromeDialog'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('components', () => {
          describe('CreateAerodromeDialog', () => {
            it('renders correctly', () => {
              const renderedValue = renderIntlMaterial(
                <CreateAerodromeDialog
                  organizationId="my_org"
                  data={{ firstname: 'Max', lastname: 'Muster', id: '24354' }}
                  updateData={() => {}}
                  open
                />,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders readonly if submitting', () => {
              const renderedValue = renderIntlMaterial(
                <CreateAerodromeDialog
                  organizationId="my_org"
                  data={{ firstname: 'Max', lastname: 'Muster', id: '24354' }}
                  updateData={() => {}}
                  submitting
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
