import React from 'react'
import renderIntl from '../../../../../../../../testutil/renderIntl'
import FuelTypes from './FuelTypes'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('routes', () => {
          describe('settings', () => {
            describe('components', () => {
              describe('FuelTypes', () => {
                it('renders fuel types', () => {
                  const tree = renderIntl(
                    <FuelTypes
                      types={[
                        { name: 'avgas', description: 'AvGas' },
                        { name: 'mogas', description: 'MoGas' }
                      ]}
                      deleteFuelTypeDialog={{
                        open: false
                      }}
                    />
                  ).toJSON()
                  expect(tree).toMatchSnapshot()
                })

                it('renders no types message', () => {
                  const tree = renderIntl(
                    <FuelTypes
                      types={[]}
                      deleteFuelTypeDialog={{
                        open: false
                      }}
                    />
                  ).toJSON()
                  expect(tree).toMatchSnapshot()
                })
              })
            })
          })
        })
      })
    })
  })
})
