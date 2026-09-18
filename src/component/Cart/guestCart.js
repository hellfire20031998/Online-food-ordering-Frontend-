// Cart for visitors who have not signed in. Lives in this browser only and expires seven days
// after the last change. Holds dishes from one restaurant at a time, like the account cart.
// On login the items are carried into the account cart via POST /api/cart/merge.

const KEY = "guestCart";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

const empty = () => ({ updatedAt: null, items: [] });

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.items)) return empty();
    if (data.updatedAt && Date.now() - data.updatedAt > TTL_MS) {
      localStorage.removeItem(KEY);
      return empty();
    }
    return data;
  } catch {
    return empty();
  }
};

const write = (data) => {
  try {
    if (!data.items.length) {
      localStorage.removeItem(KEY);
    } else {
      localStorage.setItem(KEY, JSON.stringify({ ...data, updatedAt: Date.now() }));
    }
  } catch {
    // storage unavailable (private mode, quota): the cart simply does not persist
  }
  return data;
};

const lineTotal = (item) => Number(item.food?.price || 0) * item.quantity;
const sameSet = (a = [], b = []) => a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

export const loadGuestCart = () => read();

export const hasGuestItems = () => read().items.length > 0;

export const clearGuestCart = () => write(empty());

/** Shape matching the server CartDto so the same components render either cart. */
export const guestCartView = (data = read()) => {
  const items = data.items.map((item) => ({
    id: item.id,
    foodId: item.food.id,
    foodName: item.food.name,
    food: item.food,
    quantity: item.quantity,
    ingredients: item.ingredients || [],
    totalPrice: lineTotal(item),
    price: lineTotal(item),
  }));
  const first = data.items[0];
  return {
    id: null,
    guest: true,
    restaurantId: first?.food?.restaurantId ?? null,
    restaurantName: first?.food?.restaurantName ?? null,
    total: items.reduce((sum, i) => sum + i.totalPrice, 0),
    items,
  };
};

/**
 * Adds a dish. `food` needs id, name, price, images, restaurantId, restaurantName.
 * Returns { cart } or { conflict: { currentRestaurantName } } when the cart holds another restaurant.
 */
export const addGuestItem = ({ food, quantity = 1, ingredients = [], replace = false }) => {
  let data = read();
  const current = data.items[0]?.food;
  if (current && current.restaurantId !== food.restaurantId) {
    if (!replace) return { conflict: { currentRestaurantName: current.restaurantName } };
    data = empty();
  }
  const existing = data.items.find((i) => i.food.id === food.id && sameSet(i.ingredients, ingredients));
  if (existing) {
    existing.quantity += quantity;
  } else {
    data.items.push({
      id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      food: {
        id: food.id,
        name: food.name,
        price: food.price,
        images: food.images || [],
        restaurantId: food.restaurantId,
        restaurantName: food.restaurantName,
      },
      quantity,
      ingredients: [...ingredients],
    });
  }
  return { cart: guestCartView(write(data)) };
};

export const updateGuestItem = (id, quantity) => {
  const data = read();
  const item = data.items.find((i) => i.id === id);
  if (item) item.quantity = Math.max(1, quantity);
  return guestCartView(write(data));
};

export const removeGuestItem = (id) => {
  const data = read();
  data.items = data.items.filter((i) => i.id !== id);
  return guestCartView(write(data));
};

/** Payload for POST /api/cart/merge. */
export const guestItemsForMerge = () =>
  read().items.map((i) => ({ foodId: i.food.id, quantity: i.quantity, ingredients: i.ingredients || [] }));
