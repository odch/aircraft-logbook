import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import renderIntl from '../../../../../../testutil/renderIntl'
import OrganizationDetail from './OrganizationDetail'

const StartPage = () => <div>Start Page</div>

describe('routes', () => {
  describe('organizations', () => {
    describe('routes', () => {
      describe('detail', () => {
        describe('components', () => {
          describe('OrganizationDetail', () => {
            it('renders loading icon if organization not loaded', () => {
              const tree = renderIntl(
                <OrganizationDetail
                  organization={undefined}
                  fetchAircrafts={() => {}}
                />
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('renders loading icon if aircrafts not loaded', () => {
              const tree = renderIntl(
                <OrganizationDetail
                  organization={{ id: 'my_org' }}
                  aircrafts={undefined}
                  fetchAircrafts={() => {}}
                />
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('redirects to start page if organization was not found', () => {
              const tree = renderIntl(
                <Router>
                  <Switch>
                    <Route exact path="/" component={StartPage} />
                    <OrganizationDetail
                      organization={null}
                      fetchAircrafts={() => {}}
                    />
                  </Switch>
                </Router>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('renders organization if organizatino and aircrafts loaded', () => {
              const tree = renderIntl(
                <Router>
                  <OrganizationDetail
                    organization={{ id: 'my_org' }}
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
                </Router>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('calls fetchAircrafts when mounted with organization', () => {
              const fetchAircrafts = jest.fn()

              renderIntl(
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

              renderIntl(
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
