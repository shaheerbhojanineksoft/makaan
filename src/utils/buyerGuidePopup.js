const PENDING_KEY = 'makaan-buyer-guide-pending'
const SKIP_ONCE_KEY = 'makaan-buyer-guide-skip-once'

export function markBuyerGuidePending() {
  try {
    sessionStorage.setItem(PENDING_KEY, '1')
  } catch {
    // ignore
  }
}

export function clearBuyerGuidePending() {
  try {
    sessionStorage.removeItem(PENDING_KEY)
  } catch {
    // ignore
  }
}

export function isBuyerGuidePending() {
  try {
    return sessionStorage.getItem(PENDING_KEY) === '1'
  } catch {
    return false
  }
}

export function markBuyerGuideSkipOnce() {
  try {
    sessionStorage.setItem(SKIP_ONCE_KEY, '1')
  } catch {
    // ignore
  }
}

export function consumeBuyerGuideSkipOnce() {
  try {
    if (sessionStorage.getItem(SKIP_ONCE_KEY) === '1') {
      sessionStorage.removeItem(SKIP_ONCE_KEY)
      return true
    }
  } catch {
    // ignore
  }
  return false
}

/** Full page load type from the browser Navigation Timing API. */
export function getPageLoadType() {
  try {
    const entry = performance.getEntriesByType('navigation')[0]
    if (entry?.type) return entry.type
  } catch {
    // ignore
  }
  try {
    // Legacy API fallback
    const legacy = performance.navigation?.type
    if (legacy === 1) return 'reload'
    if (legacy === 2) return 'back_forward'
  } catch {
    // ignore
  }
  return 'navigate'
}

export function isReloadNavigation() {
  return getPageLoadType() === 'reload'
}

/**
 * On dashboard full page load / restart, reopen guidance.
 * Never reopen for browser back/forward page loads.
 */
export function syncBuyerGuideOnPageLoad(isUser, pathname = '/') {
  if (!isUser) {
    clearBuyerGuidePending()
    return
  }

  const type = getPageLoadType()
  if (type === 'back_forward') {
    clearBuyerGuidePending()
    markBuyerGuideSkipOnce()
    return
  }

  // Any fresh document load on dashboard (reload OR cold open) should show guidance.
  if (pathname === '/' || pathname === '') {
    markBuyerGuidePending()
  }
}
