import { cart } from "../../data/cart.js";
import { getProduct, loadProducts } from "../data/products.js";
import { fetchOrders, getOrder } from "../data/orders.js";
import { getAmazonHeader, handleAmazonHeaderClick } from "./amazonHeader.js";
import dayjs from "https://esm.sh/dayjs";
function getTrackingMain() {
  return document.querySelector(".js-tracking-main");
}
function getProgressBar() {
  return document.querySelector(".js-progress-bar");
}
function animateProgressBar(progressBar, percent) {
  // 1. Reset to 0 explicitly
  progressBar.style.transition = "none";
  progressBar.style.width = "0%";

  // 2. Force layout (this is the magic line)
  progressBar.offsetWidth; // 👈 forces reflow forces browser to Apply all pending style changes right now.

  // 3. Re-enable transition and animate
  progressBar.style.transition = "width 1s ease";

  requestAnimationFrame(() => {
    progressBar.style.width = `${percent}%`;
  });
}
function renderTracking(data) {
  const trackingMainElm = getTrackingMain();
  let trackingMainHtml = `
  <section class="order-tracking">
    <a class="back-to-orders-link" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">${
      data.status === "delivered" ? "Delivered" : "Arriving"
    }  on: ${dayjs(data.orderItem.estimatedDeliveryDate).format("MMMM D")}</div>

    <div class="product-info">
      ${data.orderItem.productName}
    </div>

    <div class="product-info">Quantity: ${data.orderItem.quantity}</div>

    <img
      class="product-image"
      src="${data.product.image}"
    />

    <div class="progress-labels-container">
      <div class="progress-label js-preparing ${
        data.status === "preparing" ? "current-status" : ""
      }">Preparing</div>
      <div class="progress-label js-shipped ${
        data.status === "shipped" ? "current-status" : ""
      }">Shipped</div>
      <div class="progress-label js-delivered ${
        data.status === "delivered" ? "current-status" : ""
      }">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar js-progress-bar"></div>
    </div>
  </section>
  `;
  trackingMainElm.innerHTML = trackingMainHtml;
  const progressBar = getProgressBar();
  const STATUS_PROGRESS = {
    preparing: 8,
    shipped: 50,
    delivered: 100,
  };
  animateProgressBar(progressBar, STATUS_PROGRESS[data.status]);
}
function setupTrackingPage() {
  const amazonHeader = document.querySelector(".js-amazon-header");
  const form = document.querySelector(".js-search-form");
  const cartQuantityElem = getAmazonHeader().querySelector(".js-cart-quantity");
  cart.updateCartQuantity(cartQuantityElem);
  if (amazonHeader) {
    amazonHeader.addEventListener("click", handleAmazonHeaderClick);
    amazonHeader.addEventListener("click", (event) => {
      const searchButton = event.target.closest(".js-search-button");
      if (!searchButton) return;
      const searchBar = amazonHeader.querySelector(".js-search-bar");
      const query = searchBar.value;
      console.log("Tracking FORM SUBMIT");
      window.location.href = `/amazon.html?search=${encodeURIComponent(query)}`;
    });
  }
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // STOP browser submission
      const searchBar = form.querySelector(".js-search-bar");
      const query = searchBar.value;
      console.log("Tracking FORM SUBMIT");
      window.location.href = `/amazon.html?search=${encodeURIComponent(query)}`;
      return;
    });
  }
}
function noTrackingInfo() {
  getTrackingMain().innerHTML = "No Tracking Info Available";
}
function resolveTrackingData(orderId, productId) {
  const order = getOrder(orderId);
  if (!order) return null;
  const orderItem = order.getOrderItem(productId);
  if (!orderItem) return null;
  const product = getProduct(orderItem.productID);
  if (!product) return null;
  const status = order.getOrderItemStatus(orderItem);
  if (!status) return null;
  return { order, product, orderItem, status };
}
async function initTrackingPage() {
  await Promise.all([loadProducts(), fetchOrders(), cart.loadCart()]);
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("productId");
  const orderId = params.get("orderId");
  if (productId && orderId) {
    const data = resolveTrackingData(orderId, productId);
    if (!data) {
      noTrackingInfo();
      return;
    }
    renderTracking(data);
    setupTrackingPage();
    return;
  }
  noTrackingInfo();
}
initTrackingPage();
