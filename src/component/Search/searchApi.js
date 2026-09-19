import { api } from "../config/api";

/** Public search: restaurants (name / cuisine) and dishes (name / description / category). */
export const searchAll = async (query) => {
  const q = query.trim();
  if (!q) return { restaurants: [], dishes: [] };
  const [restaurants, dishes] = await Promise.all([
    api.get("api/restaurants/search", { params: { name: q } }),
    api.get("api/food/search", { params: { name: q } }),
  ]);
  return { restaurants: restaurants.data || [], dishes: dishes.data || [] };
};

/** Path of a restaurant's public page. */
export const restaurantPath = (restaurant) =>
  `/restaurant/${restaurant?.address?.city || "city"}/${restaurant?.name || "restaurant"}/${restaurant?.id}`;
