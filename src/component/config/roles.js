// Role model (mirrors backend UserRole):
//   CUSTOMER                 - public signup
//   ADMIN                    - restaurant owner (kept for backwards compatibility)
//   MANAGER / MEMBER         - restaurant staff, assigned by the owner
//   TEAM_*                   - platform team, created by a TEAM_ADMIN from the team console

export const TEAM_ROLES = [
  "TEAM_ADMIN",
  "TEAM_MANAGER",
  "TEAM_CUSTOMER_SUPPORT",
  "TEAM_RESTAURANT_SUPPORT",
];

export const TEAM_ROLE_LABELS = {
  TEAM_ADMIN: "Team Admin",
  TEAM_MANAGER: "Team Manager",
  TEAM_CUSTOMER_SUPPORT: "Customer Support",
  TEAM_RESTAURANT_SUPPORT: "Restaurant Support",
};

export const isTeamRole = (role) => TEAM_ROLES.includes(role);

export const isTeamAdmin = (role) => role === "TEAM_ADMIN";

// Suspend / block / commission actions, and unmasked bank details.
export const canManagePlatform = (role) => role === "TEAM_ADMIN" || role === "TEAM_MANAGER";

// Approve / reject restaurant owner applications.
export const canOnboardRestaurants = (role) =>
  canManagePlatform(role) || role === "TEAM_RESTAURANT_SUPPORT";

export const homeRouteForRole = (role) => {
  if (isTeamRole(role)) return "/team";
  if (role === "ADMIN") return "/admin/restaurant";
  return "/";
};

export const roleLabel = (role) => TEAM_ROLE_LABELS[role] || role;
