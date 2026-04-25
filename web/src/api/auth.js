import { api } from './client.js'

export async function login(usernameOrEmail, password) {
  const form = new URLSearchParams()
  form.set('username', usernameOrEmail)
  form.set('password', password)

  const res = await api.post('/users/token', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return res.data
}

export async function register(payload) {
  const res = await api.post('/users/register', payload)
  return res.data
}

export async function fetchMe() {
  const res = await api.get('/users/me')
  return res.data
}

export async function logout() {
  try {
    await api.post('/users/logout')
  } catch {
    // si falla la red el backend expirará la sesión igualmente
  }
}
