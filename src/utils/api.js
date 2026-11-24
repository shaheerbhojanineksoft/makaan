import { getAccessToken } from './session'

const API_BASE_URL = (import.meta.env.VITE_WEB_API_URL || '').replace(/\/$/, '')

export function getWebApiBaseUrl() {
  return API_BASE_URL
}

export async function webApi(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('VITE_WEB_API_URL is not configured')
  }

  const { auth = false, headers: customHeaders, accessToken, ...rest } = options
  const headers = {
    'Content-Type': 'application/json',
    ...(customHeaders || {}),
  }

  if (auth) {
    const token = accessToken || getAccessToken()
    if (!token) throw new Error('You are not signed in')
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
  })

  let body = null
  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (!response.ok || body?.isSuccess === false) {
    const message =
      body?.message ||
      (typeof body === 'string' ? body : null) ||
      `Request failed (${response.status})`
    const error = new Error(message)
    error.status = response.status
    error.data = body?.data ?? null
    throw error
  }

  return body?.data !== undefined ? body.data : body
}
