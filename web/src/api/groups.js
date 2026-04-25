import { api } from './client.js'

export async function listMyGroups() {
  const res = await api.get('/groups/my-groups')
  return res.data
}

export async function createGroup(payload) {
  const res = await api.post('/groups/create', payload)
  return res.data
}

export async function joinGroupByCode(code) {
  const res = await api.post('/groups/join', null, { params: { code } })
  return res.data
}

export async function getGroupDetail(groupId) {
  const res = await api.get(`/groups/${groupId}`)
  return res.data
}

export async function listGroupMembers(groupId, status = 'active') {
  const res = await api.get(`/groups/${groupId}/members`, { params: { status } })
  return res.data
}

export async function leaveGroup(groupId) {
  const res = await api.post(`/groups/${groupId}/leave`)
  return res.data
}

export async function kickMember(groupId, userId) {
  const res = await api.post(`/groups/${groupId}/kick/${userId}`)
  return res.data
}
