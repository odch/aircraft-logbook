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
                <OrganizationDetail organization={undefined} />
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('redirects to start page if organization was not found', () => {
              const tree = renderIntl(
                <Router>
                  <Switch>
                    <Route exact path="/" component={StartPage} />
                    <OrganizationDetail organization={null} />
                  </Switch>
                </Router>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })

            it('renders organization if loaded', () => {
              const tree = renderIntl(
                <Router>
                  <OrganizationDetail organization={{ id: 'my_org' }} />
                </Router>
              ).toJSON()
              expect(tree).toMatchSnapshot()
            })
          })
        })
      })
    })
  })
})
