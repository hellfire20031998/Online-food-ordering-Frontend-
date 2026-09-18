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
