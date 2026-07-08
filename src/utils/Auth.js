// Centralized helpers for reading/writing the logged-in session.
// A session stores a loginTime alongside the user, and expires after
// SESSION_DURATION_MS — so closing the server (or just leaving a tab open
// for a long time) no longer leaves a stale "still logged in" state behind.

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours — change as needed

export function saveSession(user) {
  localStorage.setItem("user", JSON.stringify({ ...user, loginTime: Date.now() }));
}

// Returns the logged-in user, or null if there isn't one / it has expired.
// Expired sessions are cleared automatically the moment this is called.
export function getSession() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    localStorage.removeItem("user");
    return null;
  }

  if (!parsed.loginTime || Date.now() - parsed.loginTime > SESSION_DURATION_MS) {
    localStorage.removeItem("user");
    return null;
  }

  return parsed;
}

export function clearSession() {
  localStorage.removeItem("user");
}