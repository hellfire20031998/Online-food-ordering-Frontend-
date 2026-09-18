import { api } from "../../component/config/api";

// Drop empty filter values so the backend sees "not set" rather than "".
const clean = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );

const data = (promise) => promise.then((res) => res.data);

export const teamApi = {
  summary: () => data(api.get("api/team/dashboard/summary")),

  restaurants: (params) => data(api.get("api/team/restaurants", { params: clean(params) })),
  restaurant: (id) => data(api.get(`api/team/restaurants/${id}`)),
  restaurantOrders: (id, params) =>
    data(api.get(`api/team/restaurants/${id}/orders`, { params: clean(params) })),
  restaurantBankAccount: (id) => data(api.get(`api/team/restaurants/${id}/bank-account`)),
  suspendRestaurant: (id) => data(api.put(`api/team/restaurants/${id}/suspend`)),
  reactivateRestaurant: (id) => data(api.put(`api/team/restaurants/${id}/reactivate`)),

  customers: (params) => data(api.get("api/team/customers", { params: clean(params) })),
  customer: (id) => data(api.get(`api/team/customers/${id}`)),
  customerOrders: (id, params) =>
    data(api.get(`api/team/customers/${id}/orders`, { params: clean(params) })),
  customerBankAccount: (id) => data(api.get(`api/team/customers/${id}/bank-account`)),
  blockCustomer: (id) => data(api.put(`api/team/customers/${id}/block`)),
  unblockCustomer: (id) => data(api.put(`api/team/customers/${id}/unblock`)),

  orders: (params) => data(api.get("api/team/orders", { params: clean(params) })),
  order: (id) => data(api.get(`api/team/orders/${id}`)),

  members: () => data(api.get("api/team/members")),
  createMember: (body) => data(api.post("api/team/members", body)),
  changeMemberRole: (id, role) => data(api.put(`api/team/members/${id}/role`, { role })),
  deactivateMember: (id) => data(api.put(`api/team/members/${id}/deactivate`)),
  reactivateMember: (id) => data(api.put(`api/team/members/${id}/reactivate`)),

  applications: (params) => data(api.get("api/team/restaurant-applications", { params: clean(params) })),
  application: (id) => data(api.get(`api/team/restaurant-applications/${id}`)),
  approveApplication: (id) => data(api.put(`api/team/restaurant-applications/${id}/approve`)),
  rejectApplication: (id, reason) => data(api.put(`api/team/restaurant-applications/${id}/reject`, { reason })),

  refunds: (params) => data(api.get("api/team/refunds", { params: clean(params) })),
  refund: (id) => data(api.get(`api/team/refunds/${id}`)),
  createRefund: (body) => data(api.post("api/team/refunds", body)),
  approveRefund: (id, body) => data(api.put(`api/team/refunds/${id}/approve`, body || {})),
  completeRefund: (id, body) => data(api.put(`api/team/refunds/${id}/complete`, body)),
  rejectRefund: (id, reason) => data(api.put(`api/team/refunds/${id}/reject`, { reason })),

  payouts: (params) => data(api.get("api/team/payouts", { params: clean(params) })),
  payout: (id) => data(api.get(`api/team/payouts/${id}`)),
  generatePayouts: (from, to) => data(api.post("api/team/payouts/generate", { from, to })),
  markPayoutPaid: (id, body) => data(api.put(`api/team/payouts/${id}/mark-paid`, body)),
  cancelPayout: (id) => data(api.put(`api/team/payouts/${id}/cancel`)),

  encryptionStatus: () => data(api.get("api/team/security/encryption")),
  rotateEncryption: () => data(api.post("api/team/security/encryption/rotate")),
  accessLog: (params) => data(api.get("api/team/security/access-log", { params: clean(params) })),

  settings: () => data(api.get("api/team/settings")),
  updateSettings: (commissionPercentage) =>
    data(api.put("api/team/settings", { commissionPercentage })),
};
