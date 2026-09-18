// The JWT carries the authorities granted at sign-in. After the team approves a restaurant
// application the user's role in the database becomes ADMIN, but their current token still
// says CUSTOMER until they sign in again. These helpers let the UI detect that mismatch.

export const tokenAuthorities = () => {
  try {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return [];
    const base64 = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return String(payload.authorities || "").split(",").filter(Boolean);
  } catch {
    return [];
  }
};

export const hasTokenAuthority = (role) => tokenAuthorities().includes(role);

// Where to send the user after they sign in (e.g. back to the cart). Session-scoped.
const REDIRECT_KEY = "postLoginRedirect";

export const setPostLoginRedirect = (path) => {
  try {
    if (path && path.startsWith("/") && !path.startsWith("/account/")) sessionStorage.setItem(REDIRECT_KEY, path);
  } catch { /* ignore */ }
};

export const peekPostLoginRedirect = () => {
  try { return sessionStorage.getItem(REDIRECT_KEY); } catch { return null; }
};

export const consumePostLoginRedirect = () => {
  const path = peekPostLoginRedirect();
  try { sessionStorage.removeItem(REDIRECT_KEY); } catch { /* ignore */ }
  return path;
};

// Pages a visitor may open without signing in. Anything else is behind ProtectedRoute and would
// bounce a signed-out visitor straight back to the login modal.
const PROTECTED_PREFIXES = ["/my-profile", "/partner", "/admin", "/team"];
export const isPublicPath = (path) =>
  Boolean(path) && !PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
