import { selectOrganization } from '../module'

export const selectOrganizationOnLoad = (store, props) => {
  store.dispatch(selectOrganization(props.router.match.params.organizationId))
}

export const selectOrganizationOnHistoryChange = (store, location) => {
  const match = location.pathname.match(/\/organizations\/([^/]+)/)
  if (match && match[1]) {
    const organizationId = match[1]
    store.dispatch(selectOrganization(organizationId))
  }
}
