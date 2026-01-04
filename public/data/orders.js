import dayjs from "https://esm.sh/dayjs";
import { getDeliveryOption } from "./deliveryOptions.js";
import { getProduct } from "./products.js";

class Order {
  orderId;
  createdTime;
  items;
  totals;
  constructor(order) {
    this.orderId = order.orderId;
    this.createdTime = order.createdTime;
    this.items = order.items ?? [];
    this.totals = order.totals ?? {};
  }
  getOrderItem(productId) {
    const matchingItem = this.items.find((item) => {
      return productId === item.productID;
    });
    return matchingItem;
  }
  getOrderItemStatus(item) {
    if (!item) return null;
    const now = dayjs();
    const createdTime = dayjs(this.createdTime);
    const estimatedDeliveryDate = dayjs(item.estimatedDeliveryDate);
    if (now.isAfter(estimatedDeliveryDate.endOf("day"))) return "delivered";
    const halfway = createdTime.add(
      estimatedDeliveryDate.diff(createdTime) / 2,
      "millisecond"
    );
    if (now.isAfter(halfway)) return "shipped";
    return "preparing";
  }
}
export function getOrder(orderId) {
  const matchingOrder = orders.find((order) => {
    return orderId === order.orderId;
  });
  return matchingOrder;
}

export function calculateOrderFromCart(cart) {
  if (!cart || cart.cartItems.length === 0) {
    return {
      items: [],
      totals: {
        itemsSubTotalCents: 0,
        totalShippingCostCents: 0,
        totalTaxCents: 0,
        grandTotalCents: 0,
      },
    };
  }
  const now = dayjs();
  const orderItems = cart.cartItems.map((item) => {
    const product = getProduct(item.productID);
    const unitPriceCents = product.priceCents;
    const quantity = item.quantity;
    const lineSubTotalCents = unitPriceCents * quantity;
    const itemShippingCost = getDeliveryOption(
      item.deliveryOptionID
    ).priceCents;
    return {
      productID: item.productID,
      productName: product.name,
      quantity,
      unitPriceCents,
      lineSubTotalCents,
      itemShippingCost,
      estimatedDeliveryDate: now
        .add(getDeliveryOption(item.deliveryOptionID).deliveryDays, "day")
        .toISOString(),
    };
  });
  const itemsSubTotalCents = orderItems.reduce((sum, item) => {
    return sum + item.lineSubTotalCents;
  }, 0);
  const totalShippingCostCents = orderItems.reduce((sum, item) => {
    return sum + item.itemShippingCost;
  }, 0);
  const taxRate = 0.01;
  const totalTaxCents = Math.round(
    (itemsSubTotalCents + totalShippingCostCents) * taxRate
  );
  const grandTotalCents =
    itemsSubTotalCents + totalShippingCostCents + totalTaxCents;
  return {
    createdTime: now.toISOString(),
    items: orderItems,
    totals: {
      itemsSubTotalCents,
      totalShippingCostCents,
      totalTaxCents,
      grandTotalCents,
    },
  };
}
export async function placeOrder(cart) {
  const order = calculateOrderFromCart(cart);
  if (!order) return null;
  await postOrder(order);
  return order;
}
async function postOrder(order) {
  try {
    const res = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (!res.ok) {
      throw new Error(`Failed to place Order (${res.status})`);
    }
    console.log("Order Placed");
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Network error while placing Order"
    );
  }
}
export async function fetchOrders() {
  try {
    const res = await fetch("http://localhost:3000/api/orders");
    // HTTP error handling (xhr.status check)
    if (!res.ok) {
      throw new Error(`Failed to load orders (${res.status})`);
    }
    // Equivalent of xhr.responseType = "json"
    const data = await res.json();

    orders = (data.orders || []).map((order) => new Order(order));
    console.log("Orders Loaded");
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Network error while loading Orders"
    );
  }
}
export let orders = [];
