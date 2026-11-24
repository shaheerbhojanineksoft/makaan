const GIS_SRC = 'https://accounts.google.com/gsi/client'

let scriptPromise = null

export function getGoogleClientId() {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim()
}

export function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load Google Sign-In')),
      )
      if (window.google?.accounts?.id) resolve()
      return
    }

    const script = document.createElement('script')
    script.src = GIS_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Sign-In'))
    document.head.appendChild(script)
  })

  return scriptPromise
}

/**
 * Mount official Google Sign-In button into `container`.
 * Calls `onCredential(idToken)` when user completes Google login.
 */
export async function mountGoogleButton(container, { onCredential, onError }) {
  const clientId = getGoogleClientId()
  if (!clientId || clientId.includes('your-google-oauth-client-id')) {
    throw new Error('VITE_GOOGLE_CLIENT_ID is not configured')
  }
  if (!container) {
    throw new Error('Google button container is missing')
  }

  await loadGoogleScript()

  if (!window.google?.accounts?.id) {
    throw new Error('Google Sign-In is unavailable')
  }

  container.innerHTML = ''

  try {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response?.credential) onCredential?.(response.credential)
        else onError?.(new Error('Google did not return an ID token'))
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      // FedCM often causes 403/blocked prompts on localhost — keep classic flow
      use_fedcm_for_prompt: false,
      context: 'signin',
    })

    window.google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      logo_alignment: 'left',
      width: Math.min(container.clientWidth || 320, 400),
    })
  } catch (err) {
    const message = String(err?.message || err || '')
    if (/origin/i.test(message) || /403/i.test(message)) {
      throw new Error(
        `Google 403: add ${window.location.origin} under Authorized JavaScript origins for this Client ID.`,
      )
    }
    throw err instanceof Error ? err : new Error(message || 'Google Sign-In failed')
  }
}
