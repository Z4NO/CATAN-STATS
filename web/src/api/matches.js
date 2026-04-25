import { api } from './client.js'

export async function listGroupMatches(groupId, { limit = 20, offset = 0, rulesetId } = {}) {
  const params = { limit, offset }
  if (rulesetId) params.ruleset_id = rulesetId
  const res = await api.get(`/groups/${groupId}/matches`, { params })
  return res.data
}

export async function createMatch(groupId, payload) {
  const res = await api.post(`/groups/${groupId}/matches`, payload)
  return res.data
}

export async function getMatchDetail(matchId) {
  const res = await api.get(`/matches/${matchId}`)
  return res.data
}

export async function deleteMatch(matchId) {
  await api.delete(`/matches/${matchId}`)
}
