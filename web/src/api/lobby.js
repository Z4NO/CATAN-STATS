import { api } from './client.js'

export const createLobby = ({ groupId, rulesetId }) =>
  api.post('/lobbys/create', { group_id: groupId, ruleset_id: rulesetId }).then(r => r.data)

export const getLobby = (lobbyId) =>
  api.get(`/lobbys/${lobbyId}`).then(r => r.data)

export const joinLobby = (lobbyId) =>
  api.post(`/lobbys/${lobbyId}/join`).then(r => r.data)

export const setReady = (lobbyId, isReady = true) =>
  api.post(`/lobbys/${lobbyId}/ready`, null, { params: { is_ready: isReady } }).then(r => r.data)

export const startLobby = (lobbyId) =>
  api.post(`/lobbys/${lobbyId}/start`).then(r => r.data)

export const inviteToLobby = (lobbyId, userId) =>
  api.post(`/lobbys/invite/${lobbyId}/${userId}`).then(r => r.data)
