import { api } from './client.js'

export async function listRulesets() {
  const res = await api.get('/rulesets/')
  return res.data
}
