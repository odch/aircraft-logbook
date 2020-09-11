import React from 'react'
import renderIntl from '../../../../../../../../testutil/renderIntl'
import SettingSwitch from './SettingSwitch'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('aircraft', () => {
        describe('routes', () => {
          describe('settings', () => {
            describe('components', () => {
              describe('AdvancedSettings', () => {
                describe('SettingSwitch', () => {
                  it('renders correctly unchecked', () => {
                    const tree = renderIntl(
                      <SettingSwitch
                        label="My test switch"
                        checked={false}
                        onChange={() => {}}
                      />
                    ).toJSON()
                    expect(tree).toMatchSnapshot()
                  })

                  it('renders correctly checked', () => {
                    const tree = renderIntl(
                      <SettingSwitch
                        label="My test switch"
                        checked={true}
                        onChange={() => {}}
                      />
                    ).toJSON()
                    expect(tree).toMatchSnapshot()
                  })

                  it('renders switch readonly with loading indicator when submitting', () => {
                    const tree = renderIntl(
                      <SettingSwitch
                        label="My test switch"
                        checked={true}
                        submitting
                        onChange={() => {}}
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
})
