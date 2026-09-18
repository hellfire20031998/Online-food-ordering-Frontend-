import { api } from "../config/api";

const data = (promise) => promise.then((res) => res.data);

export const partnerApi = {
  myApplications: () => data(api.get("api/restaurant-applications/me")),
  submit: (body) => data(api.post("api/restaurant-applications", body)),
  withdraw: (id) => data(api.put(`api/restaurant-applications/${id}/withdraw`)),
};

export const ownerApi = {
  bankAccount: (restaurantId) => data(api.get(`api/admin/restaurants/${restaurantId}/bank-account`)),
  saveBankAccount: (restaurantId, body) => data(api.put(`api/admin/restaurants/${restaurantId}/bank-account`, body)),
  earnings: (restaurantId) => data(api.get(`api/admin/restaurants/${restaurantId}/earnings`)),
  payouts: (restaurantId) => data(api.get(`api/admin/restaurants/${restaurantId}/payouts`)),
  payout: (restaurantId, payoutId) => data(api.get(`api/admin/restaurants/${restaurantId}/payouts/${payoutId}`)),
};
