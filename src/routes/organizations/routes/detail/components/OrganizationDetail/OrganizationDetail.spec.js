import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import renderIntl, {
  renderIntlMaterial
} from '../../../../../../testutil/renderIntl'
import OrganizationDetail from './OrganizationDetail'

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('detail', () => {
        describe('components', () => {
          describe('OrganizationDetail', () => {
            it('renders loading icon if organization not loaded', () => {
              const renderedValue = renderIntlMaterial(
                <OrganizationDetail
                  organization={undefined}
                  fetchAircrafts={() => {}}
                />,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders loading icon if aircrafts not loaded', () => {
              const renderedValue = renderIntlMaterial(
                <OrganizationDetail
                  organization={{ id: 'my_org' }}
                  aircrafts={undefined}
                  fetchAircrafts={() => {}}
                />,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('shows message if organization was not found or user is not granted', () => {
              const renderedValue = renderIntlMaterial(
                <OrganizationDetail
                  organizationId="my_org"
                  userEmail="test@opendigital.ch"
                  organization={null}
                  aircrafts={null}
                  fetchAircrafts={() => {}}
                />,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders organization if organization and aircrafts loaded', () => {
              const renderedValue = renderIntlMaterial(
                <Router>
                  <OrganizationDetail
                    organization={{ id: 'my_org', roles: [] }}
                    aircrafts={[
                      {
                        id: 'o7flC7jw8jmkOfWo8oyA',
                        registration: 'HBKFW'
                      },
                      {
                        id: 'BKi7HYAIoe1i75H3LMk1',
                        registration: 'HBKOF'
                      }
                    ]}
                    fetchAircrafts={() => {}}
                  />
                </Router>,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders with create button for aircrafts if is manager', () => {
              const renderedValue = renderIntlMaterial(
                <Router>
                  <OrganizationDetail
                    organization={{ id: 'my_org', roles: ['manager'] }}
                    aircrafts={[
                      {
                        id: 'o7flC7jw8jmkOfWo8oyA',
                        registration: 'HBKFW'
                      },
                      {
                        id: 'BKi7HYAIoe1i75H3LMk1',
                        registration: 'HBKOF'
                      }
                    ]}
                    fetchAircrafts={() => {}}
                  />
                </Router>,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('renders without create button if aircrafts limit is reached', () => {
              const renderedValue = renderIntlMaterial(
                <Router>
                  <OrganizationDetail
                    organization={{
                      id: 'my_org',
                      roles: ['manager'],
                      limits: { aircrafts: 2 }
                    }}
                    aircrafts={[
                      {
                        id: 'o7flC7jw8jmkOfWo8oyA',
                        registration: 'HBKFW'
                      },
                      {
                        id: 'BKi7HYAIoe1i75H3LMk1',
                        registration: 'HBKOF'
                      }
                    ]}
                    fetchAircrafts={() => {}}
                  />
                </Router>,
                true
              )
              expect(renderedValue).toMatchSnapshot()
            })

            it('calls fetchAircrafts when mounted with organization', () => {
              const fetchAircrafts = jest.fn()

              renderIntlMaterial(
                <OrganizationDetail
                  organization={{ id: 'my_org' }}
                  aircrafts={undefined}
                  fetchAircrafts={fetchAircrafts}
                />
              )

              expect(fetchAircrafts).toBeCalledWith('my_org')
            })

            it('does not call fetchAircrafts when mounted without organization', () => {
              const fetchAircrafts = jest.fn()

              renderIntlMaterial(
                <OrganizationDetail
                  organization={undefined}
                  aircrafts={undefined}
                  fetchAircrafts={fetchAircrafts}
                />
              )

              expect(fetchAircrafts).not.toBeCalled()
            })

            it('calls fetchAircrafts when updated with new organization', () => {
              const fetchAircrafts = jest.fn()

              const renderer = renderIntl(
                <OrganizationDetail
                  organization={undefined}
                  aircrafts={undefined}
                  fetchAircrafts={fetchAircrafts}
                />
              )

              expect(fetchAircrafts).not.toBeCalled()

              renderer.update(
                <OrganizationDetail
                  organization={{ id: 'my_org' }}
                  aircrafts={undefined}
                  fetchAircrafts={fetchAircrafts}
                />
              )

              expect(fetchAircrafts).toBeCalledWith('my_org')
            })
          })
        })
      })
    })
  })
})
