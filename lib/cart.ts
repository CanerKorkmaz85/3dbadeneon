export type CartItem = {
  id: string;
  title: string;
  image: string;
  size: string;
  remote: string;
  quantity: number;
  unitPrice: number | null;
};

const KEY = "3dbade-cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const items = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: CartItem) {
  const items = readCart();
  const existing = items.find(
    (entry) =>
      entry.id === item.id &&
      entry.size === item.size &&
      entry.remote === item.remote
  );

  if (existing) {
    existing.quantity += item.quantity;
    existing.unitPrice = item.unitPrice;
  } else {
    items.push({ ...item });
  }

  writeCart(items);
}