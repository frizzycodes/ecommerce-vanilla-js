import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { placeOrder, calculateOrderFromCart } from "../../data/orders.js";
export function renderPaymentSummary() {
  const paymentSummary = document.querySelector(".js-payment-summary");
  const order = calculateOrderFromCart(cart);
  const totalItems = order.items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);
  const paymentSummaryHtml = `
              <div class="payment-info">
                  <div class="payment-summary-title">
                      Order Summary
                  </div>
                  <div class="payment-summary-row">
                      <span>
                          Items (${totalItems}):
                      </span>
                      <span class="payment-summary-cost js-payment-summary-cost">
                          $${formatCurrency(order.totals.itemsSubTotalCents)}
                      </span>  
                  </div>
                  <div class="payment-summary-row">
                      <span>
                          Shipping & handling:
                      </span>
                      <span class="payment-summary-cost js-shipping-cost">
                          $${formatCurrency(
                            order.totals.totalShippingCostCents
                          )}
                      </span>  
                  </div>
                  <div class="payment-summary-row subtotal-row">
                      <span>
                          Total before tax:
                      </span>
                      <span class="payment-summary-cost js-price-before-tax">
                          $${formatCurrency(
                            order.totals.itemsSubTotalCents +
                              order.totals.totalShippingCostCents
                          )}
                      </span>  
                  </div>
                  <div class="payment-summary-row">
                      <span>
                          Estimated tax (10%):
                      </span>
                      <span class="payment-summary-cost">
                          $${formatCurrency(order.totals.totalTaxCents)}
                      </span>  
                  </div>
                  <div class="payment-summary-row total-cost">
                      <span>
                          Order total:
                      </span>
                      <span class="payment-summary-cost">
                          $${formatCurrency(order.totals.grandTotalCents)}
                      </span>  
                  </div>
                  <div class="payment-button-container ${
                    totalItems ? "" : "disabled"
                  }">
                      <button class="payment-button js-payment-button">
                          Place your order
                      </button>
                  </div>
              </div>
          `;
  paymentSummary.innerHTML = paymentSummaryHtml;
}
export async function handlePaymentSummaryClick(event) {
  const placeOrderBtn = event.target.closest(".js-payment-button");
  if (placeOrderBtn) {
    await placeOrder(cart);
    cart.cartItems = [];
    await cart.saveCart();
    window.location.href = "/orders.html";
  }
}
