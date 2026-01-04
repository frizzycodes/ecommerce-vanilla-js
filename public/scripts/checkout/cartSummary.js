import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js"; // named export
import {
  deliveryOptions,
  getDeliveryOption,
  getDeliveryDate,
} from "../../data/deliveryOptions.js";
import { refreshCheckout } from "../checkout.js";

export function renderCartSummary() {
  const cartSummary = document.querySelector(".js-cart-summary");
  let cartSummaryHtml = "";
  if (cart.cartItems.length == 0) {
    cartSummaryHtml += `
            <div>
                Your cart is empty.
            </div>
            <a class="view-products-link" href="amazon.html">
                View products
            </a>
        `;
  } else {
    cart.cartItems.forEach((item) => {
      const productID = item.productID;
      const matchingCartItem = item;
      const cartItemInfo = getProduct(productID);
      const deliveryOptionID = matchingCartItem.deliveryOptionID;
      const deliveryOption = getDeliveryOption(deliveryOptionID);
      const dateString = getDeliveryDate(deliveryOption);
      cartSummaryHtml += `
                    <div class="cart-item-container js-cart-item-container js-cart-item-container-${
                      cartItemInfo.id
                    }">
                        <div class="cart-item-delivery-date">
                            Delivery date: ${dateString}
                            <span class=""></span>
                        </div>
                        <div class="cart-item-details-grid">
                            <img class="cart-item-image" src="${
                              cartItemInfo.image
                            }" alt="">    
                            <div class="cart-item-details">
                                <div class="cart-item-name js-cart-item-name-${
                                  cartItemInfo.id
                                }">
                                    ${cartItemInfo.name}
                                </div>
                                <div class="cart-item-price js-cart-item-price-${
                                  cartItemInfo.id
                                }">
                                    $${cartItemInfo.getPrice()}
                                </div>
                                <div class="cart-item-quantity-container js-cart-item-quantity-container-${
                                  cartItemInfo.id
                                }" data-product-id="${cartItemInfo.id}">
                                    Quantity:
                                    <span class="cart-item-quantity">${
                                      matchingCartItem.quantity
                                    }</span>
                                    <input class="quantity-selector js-quantity-selector" type="number" value="${
                                      matchingCartItem.quantity
                                    }" data-product-id="${cartItemInfo.id}">
                                    <span class="quantity-update-link js-quantity-update-link" data-product-id="${
                                      cartItemInfo.id
                                    }" >Update</span>
                                    <span class="quantity-save-link js-quantity-save-link" data-product-id="${
                                      cartItemInfo.id
                                    }">Save</span>
                                    <span class="quantity-delete-link js-item-delete js-item-delete-${
                                      cartItemInfo.id
                                    }" data-product-id="${
        cartItemInfo.id
      }">Delete</span>
                                </div>
                            </div>
                            <div class="cart-item-delivery-options">
                                <div class="delivery-options-title">
                                    Choose a delivery option:
                                </div>
                                ${deliveryOptionsHtml(
                                  cartItemInfo,
                                  matchingCartItem
                                )}
                            </div>
                        </div>
                    </div>
                `;
    });
  }
  cartSummary.innerHTML = cartSummaryHtml;
}
export function deliveryOptionsHtml(cartItemInfo, matchingCartItem) {
  let html = "";
  deliveryOptions.forEach((deliveryOption) => {
    const isChecked = deliveryOption.id === matchingCartItem.deliveryOptionID;
    const dateString = getDeliveryDate(deliveryOption);
    const priceString =
      deliveryOption.priceCents === 0
        ? "FREE"
        : `$${formatCurrency(deliveryOption.priceCents)}`;
    html += `
            <div class="delivery-option js-delivery-option js-delivery-option-${
              cartItemInfo.id
            } js-delivery-option-${deliveryOption.id}" data-product-id="${
      cartItemInfo.id
    }" data-delivery-option-id="${deliveryOption.id}">
                <input class="delivery-option-input js-delivery-option-input-${
                  cartItemInfo.id
                } js-delivery-option-input-${
      deliveryOption.id
    }" type="radio" name="delivery-option-${cartItemInfo.id}" ${
      isChecked ? "checked" : ""
    }>
                <div class="delivery-option-details">
                    <div class="delivery-option-date">
                        ${dateString} 
                    </div>
                    <div class="delivery-option-price">
                        ${priceString} - Shipping
                    </div>
                </div>
            </div>        
        `;
  });
  return html;
}
export function enterEditMode(productID) {
  const quantityContainer = document.querySelector(
    `.cart-item-quantity-container[data-product-id="${productID}"]`
  );
  quantityContainer.classList.add("is-editing");
  quantityContainer.querySelector(".js-quantity-selector").focus();
  return;
}
export function saveQuantity(productID) {
  const quantityContainer = document.querySelector(
    `.cart-item-quantity-container[data-product-id="${productID}"]`
  );
  const inputElem = quantityContainer.querySelector(".js-quantity-selector");
  const newQuantity = Number(inputElem.value);
  if (newQuantity === 0) {
    cart.deleteCartItem(productID);
  } else if (newQuantity > 0 && newQuantity < 1000) {
    cart.updateCartItemQuantity(productID, newQuantity);
  }
  quantityContainer.classList.remove("is-editing");
  refreshCheckout();
}
export function handleCartSummaryClick(event) {
  const deleteItemLink = event.target.closest(".js-item-delete");
  if (deleteItemLink) {
    const productID = deleteItemLink.dataset.productId;
    cart.deleteCartItem(productID);
    refreshCheckout();
    return;
  }

  const updateQuantityLink = event.target.closest(".js-quantity-update-link");
  if (updateQuantityLink) {
    enterEditMode(updateQuantityLink.dataset.productId);
    return;
  }
  const saveNewQuantityLink = event.target.closest(".js-quantity-save-link");
  if (saveNewQuantityLink) {
    saveQuantity(saveNewQuantityLink.dataset.productId);
    return;
  }
  const deliveryOptionElem = event.target.closest(".js-delivery-option");
  if (deliveryOptionElem) {
    const { productId } = deliveryOptionElem.dataset;
    const deliveryOptionId = Number(
      deliveryOptionElem.dataset.deliveryOptionId
    );
    cart.updateDeliveryOption(productId, deliveryOptionId);
    refreshCheckout();
    return;
  }
}
export function handleCartSummaryKeyDown(event) {
  if (event.key === "Enter") {
    if (event.target.matches(".js-quantity-selector")) {
      const quantityContainer = event.target.closest(
        ".cart-item-quantity-container"
      );
      saveQuantity(quantityContainer.dataset.productId);
      return;
    }
  }
}
