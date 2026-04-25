import { api } from './client.js'

export async function getGroupStats(groupId, rulesetId) {
  const params = rulesetId ? { ruleset_id: rulesetId } : undefined
  const res = await api.get(`/groups/${groupId}/stats`, { params })
  return res.data
}

export async function getPlayerProfileStats(groupId, userId) {
  const res = await api.get(`/groups/${groupId}/players/${userId}/stats`)
  return res.data
}
