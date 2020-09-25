import { call, select } from 'redux-saga/effects'
import { getDoc } from '../../../util/firestoreUtils'

export const uidSelector = state => state.firebase.auth.uid
export const organizationMembersSelector = state =>
  state.firestore.ordered.organizationMembers

export function* getCurrentMemberObject(organizationId) {
  const currentMember = yield call(getCurrentMember)
  return yield call(getMemberObject, organizationId, currentMember.id)
}

export function* getMemberObject(organizationId, memberId) {
  const memberDoc = yield call(getMember, organizationId, memberId)
  return memberObject(memberDoc)
}

function* getMember(organizationId, memberId) {
  return yield call(getDoc, [
    'organizations',
    organizationId,
    'members',
    memberId
  ])
}

export function* getCurrentMember() {
  const userId = yield select(uidSelector)
  const organizationMembers = yield select(organizationMembersSelector)
  const member = organizationMembers.find(m => m.user && m.user.id === userId)
  if (!member) {
    throw `Member not found for uid ${userId}`
  }
  return member
}

export const memberObject = memberDocument =>
  memberDocument && memberDocument.exists
    ? {
        firstname: memberDocument.get('firstname') || null,
        lastname: memberDocument.get('lastname') || null,
        nr: memberDocument.get('nr') || null,
        member: memberDocument.ref,
        id: memberDocument.id
      }
    : null
