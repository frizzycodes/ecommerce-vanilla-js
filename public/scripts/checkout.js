import { cart } from "../data/cart.js";
import {
  renderCartSummary,
  handleCartSummaryClick,
  handleCartSummaryKeyDown,
} from "./checkout/cartSummary.js";
import {
  renderPaymentSummary,
  handlePaymentSummaryClick,
} from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";
export function refreshCheckout() {
  const cartQuantityElem = document.querySelector(".js-cart-quantity");
  cart.updateCartQuantity(cartQuantityElem);
  renderCartSummary();
  renderPaymentSummary();
}
function setupCheckout() {
  const cartSummary = document.querySelector(".js-cart-summary");
  const paymentSummary = document.querySelector(".js-payment-summary");
  if (!cartSummary) return; // nothing to do on pages / tests without this element
  if (!paymentSummary) return; // nothing to do on pages / tests without this element

  cartSummary.addEventListener("click", handleCartSummaryClick);
  paymentSummary.addEventListener("click", handlePaymentSummaryClick);
  cartSummary.addEventListener("keydown", handleCartSummaryKeyDown);
}

async function inntCheckout() {
  await Promise.all([loadProducts(), cart.loadCart()]);
  if (document.querySelector(".js-cart-summary")) {
    setupCheckout();
    refreshCheckout();
  }
}
inntCheckout();
