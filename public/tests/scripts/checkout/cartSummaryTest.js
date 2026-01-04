import {
  renderCartSummary,
  handleCartSummaryClick,
} from "../../../scripts/checkout/cartSummary.js";
import { cart } from "../../../data/cart.js";
import { formatCurrency } from "../../../scripts/utils/money.js";

describe("test suite: refreshCheckout", () => {
  const product1 = {
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
    price: 1090,
  };
  const product2 = {
    id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    name: "Intermediate Size Basketball",
    price: 2095,
  };
  beforeEach(() => {
    document.querySelector(".js-test-container").innerHTML = `
            <div class="js-cart-summary"></div>
            <div class="js-payment-summary"></div>
            `;
    cart.cartItems = [
      {
        productID: product1.id,
        quantity: 2,
        deliveryOptionID: 1,
      },
      {
        productID: product2.id,
        quantity: 1,
        deliveryOptionID: 2,
      },
    ];
    renderCartSummary();
  });
  it("displays the checkout cart", () => {
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      2
    );
    expect(
      document.querySelector(`.js-cart-item-quantity-container-${product1.id}`)
        .innerText
    ).toContain("Quantity: 2");
    expect(
      document.querySelector(`.js-cart-item-quantity-container-${product2.id}`)
        .innerText
    ).toContain("Quantity: 1");
    expect(
      document.querySelector(`.js-cart-item-price-${product1.id}`).innerText
    ).toContain(`$${formatCurrency(product1.price)}`);
    expect(
      document.querySelector(`.js-cart-item-price-${product2.id}`).innerText
    ).toContain(`$${formatCurrency(product2.price)}`);
    expect(
      document.querySelector(`.js-cart-item-name-${product1.id}`).innerText
    ).toContain(`${product1.name}`);
    expect(
      document.querySelector(`.js-cart-item-name-${product2.id}`).innerText
    ).toContain(`${product2.name}`);
    document.querySelector(".js-test-container").innerHTML = ``;
  });
  it("removes a cart item", () => {
    handleCartSummaryClick({
      target: document.querySelector(`.js-item-delete-${product1.id}`),
    });
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productID).toEqual(product2.id);
    document.querySelector(".js-test-container").innerHTML = ``;
  });
});
