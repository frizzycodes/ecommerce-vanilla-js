import { cart } from "../../data/cart.js";
import { getProduct, loadProducts } from "../data/products.js";
import { fetchOrders, orders } from "../data/orders.js";
import { getAmazonHeader, handleAmazonHeaderClick } from "./amazonHeader.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://esm.sh/dayjs";

function getOrdersGrid() {
  return document.querySelector(".js-orders-grid");
}
function getPageTitle() {
  return document.querySelector(".js-page-title");
}

function renderOrders(orders) {
  const ordersGrid = getOrdersGrid();
  const pageTittle = getPageTitle();
  let orderHtml = "";
  if (orders.length === 0) {
    ordersGrid.classList.add("is-empty");
    pageTittle.innerText = "You Have No Orders";
    orderHtml += `<a class="view-products-link" href="amazon.html">
      View products
      </a>
    `;
  } else {
    orders.forEach((order) => {
      let orderItemsHtml = "";
      order.items.forEach((item) => {
        const product = getProduct(item.productID);
        orderItemsHtml += `
        <div class="order-item">
          <div class="order-item-image">
            <img
              src="/${product.image}"
              alt=""
            />
          </div>
          <div class="order-item-details">
            <div class="order-item-name">
              ${product.name}
            </div>
            <div class="order-item-delivery-date">
              ${
                order.getOrderItemStatus(item) === "delivered"
                  ? "Delivered"
                  : "Arriving"
              }  on: ${dayjs(item.estimatedDeliveryDate).format("MMMM D")}
            </div>
            <div class="order-item-quantity">Quantity: ${item.quantity}</div>
            <button class="buy-again-button js-buy-again-button" data-product-id =${
              item.productID
            }>
              <img
                class="buy-again-icon"
                src="/images/icons/buy-again.png"
                alt=""
              />
              <span class="buy-again-label js-buy-again-label">Buy it again</span>
              
            </button>
          </div>
          <div class="order-item-action">
            <button class="track-package-button js-track-package-button" data-order-id="${
              order.orderId
            }" data-product-id="${item.productID}">Track package</button>
          </div>
        </div>
        `;
      });
      orderHtml += `
      <div class="order-container">
        <div class="order-header">
          <div class="left-section">
            <div class="order-date-container">
              <div class="order-header-label">Order Placed:</div>
              <div class="order-date">${dayjs(order.createdTime).format(
                "MMMM D"
              )}</div>
            </div>
            <div class="order-price-container">
              <div class="order-header-label">Total:</div>
              <div class="order-total-price">$${formatCurrency(
                order.totals.grandTotalCents
              )}</div>
            </div>
          </div>
          <div class="right-section">
            <div class="order-id-container">
              <div class="order-header-label">Order ID:</div>
              <div class="order-id">${order.orderId}</div>
            </div>
          </div>
        </div>
        <div class="order-details-grid">
          ${orderItemsHtml}
        </div>
      </div>
      `;
    });
  }
  ordersGrid.innerHTML = orderHtml;
}
function setUpOrders() {
  const amazonHeader = document.querySelector(".js-amazon-header");
  const form = document.querySelector(".js-search-form");
  const ordersGrid = getOrdersGrid();
  const cartQuantityElem = getAmazonHeader().querySelector(".js-cart-quantity");
  cart.updateCartQuantity(cartQuantityElem);
  if (amazonHeader) {
    amazonHeader.addEventListener("click", handleAmazonHeaderClick);
    amazonHeader.addEventListener("click", (event) => {
      const searchButton = event.target.closest(".js-search-button");
      if (!searchButton) return;
      const searchBar = amazonHeader.querySelector(".js-search-bar");
      const query = searchBar.value;
      console.log("ORDERS FORM SUBMIT");
      window.location.href = `/amazon.html?search=${encodeURIComponent(query)}`;
    });
  }
  if (ordersGrid) {
    ordersGrid.addEventListener("click", async (event) => {
      const buyAgainBtn = event.target.closest(".js-buy-again-button");
      const trackPackageBtn = event.target.closest(".js-track-package-button");
      if (buyAgainBtn) {
        const productID = buyAgainBtn.dataset.productId;
        await cart.addToCart(productID);
        const cartQuantityElem =
          getAmazonHeader().querySelector(".js-cart-quantity");
        cart.updateCartQuantity(cartQuantityElem);
        buyAgainBtn.querySelector(".js-buy-again-label").innerText = "✓ Added";
        return;
      }
      if (trackPackageBtn) {
        const productID = trackPackageBtn.dataset.productId;
        const orderID = trackPackageBtn.dataset.orderId;
        console.log(productID, orderID);
        const params = new URLSearchParams();
        params.set("productId", productID);
        params.set("orderId", orderID);
        const url = `/tracking.html?${params.toString()}`;
        window.location.href = url;
      }
    });
  }
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // STOP browser submission
      const searchBar = form.querySelector(".js-search-bar");
      const query = searchBar.value;
      console.log("ORDERS FORM SUBMIT");
      window.location.href = `/amazon.html?search=${encodeURIComponent(query)}`;
      return;
    });
  }
}

async function initOrders() {
  await Promise.all([loadProducts(), fetchOrders(), cart.loadCart()]);
  renderOrders(orders);
  setUpOrders();
}
initOrders();
