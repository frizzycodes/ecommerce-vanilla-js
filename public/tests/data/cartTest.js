import {
  addToCart,
  cart,
  loadFromStorage,
  deleteCartItem,
  updateDeliveryOption,
} from "../../data/cart.js";
import {
  renderCartSummary,
  handleCartSummaryClick,
} from "../../../scripts/checkout/cartSummary.js";
import { formatCurrency } from "../../../scripts/utils/money.js";

// Flakey test means it sometimes passes and sometimes fails
describe("test suite: addToCart", () => {
  const productID1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  beforeEach(() => {
    spyOn(localStorage, "setItem").and.stub();
    document.querySelector(".js-test-container").innerHTML = `
        <input class="js-cart-quantity-selector-${productID1}" type="number" value="1">
    `;
  });
  afterEach(() => {
    document.querySelector(".js-test-container").innerHTML = ``;
  });
  it("adds a new product into the cart", () => {
    //used to check how many times a function have called using expect().toHaveBeenCalledTimes(n);
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([]);
    }); // used to create a mock object “Hey Jasmine, whenever the code tries to run localStorage.getItem(), don’t run the real one — run my fake one instead, and track if it was called
    loadFromStorage();

    addToCart(productID1);
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        {
          productID: productID1,
          quantity: 1,
          deliveryOptionID: 1,
        },
      ])
    );
    expect(cart[0].productID).toEqual(productID1);
    expect(cart[0].quantity).toEqual(1);
  });

  it("adds an existing product into the cart", () => {
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productID: productID1,
          quantity: 1,
          deliveryOptionID: 1,
        },
      ]);
    });
    loadFromStorage();
    addToCart(productID1);
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        {
          productID: productID1,
          quantity: 2,
          deliveryOptionID: 1,
        },
      ])
    );
    expect(cart[0].productID).toEqual(productID1);
    expect(cart[0].quantity).toEqual(2);
  });
});

describe("test suite: deleteCartItem", () => {
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
  const product3 = {
    id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
    name: "Adults Plain Cotton T-Shirt - 2 Pack",
    price: 799,
  };

  beforeEach(() => {
    document.querySelector(".js-test-container").innerHTML = `
                <div class="js-cart-summary"></div>
                <div class="js-payment-summary"></div>
                `;
    spyOn(localStorage, "setItem").and.stub();
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
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
      ]);
    });
    loadFromStorage();
  });

  it("removes a productId that is in the cart", () => {
    deleteCartItem(product1.id);
    expect(cart.length).toEqual(1);
    expect(cart[0].productID).toEqual(product2.id);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        {
          productID: product2.id,
          quantity: 1,
          deliveryOptionID: 2,
        },
      ])
    );
  });

  it("dose not remove a productId that is not in the cart", () => {
    deleteCartItem(product3.id);
    expect(cart.length).toEqual(2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
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
      ])
    );
  });
});
describe("test suite: updateDeliveryOption", () => {
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
  const product3 = {
    id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
    name: "Adults Plain Cotton T-Shirt - 2 Pack",
    price: 799,
  };
  beforeEach(() => {
    document.querySelector(".js-test-container").innerHTML = `
            <div class="js-cart-summary"></div>
            <div class="js-payment-summary"></div>
            `;
    spyOn(localStorage, "setItem").and.stub();
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productID: product1.id,
          quantity: 1,
          deliveryOptionID: 1,
        },
        {
          productID: product2.id,
          quantity: 1,
          deliveryOptionID: 2,
        },
      ]);
    });
    loadFromStorage();
    renderCartSummary();
  });
  afterEach(() => {
    document.querySelector(".js-test-container").innerHTML = ``;
  });
  it("changes delivery option for a productId that is in the cart", () => {
    handleCartSummaryClick({
      target: document.querySelector(
        `.js-delivery-option-${product1.id}.js-delivery-option-${3}`
      ),
    });
    let shippingPrice = Number(
      document
        .querySelector(".js-shipping-cost")
        .innerText.replace(/[^\d.]/g, "")
    );
    let totalPrice = Number(
      document
        .querySelector(".js-price-before-tax")
        .innerText.replace(/[^\d.]/g, "")
    );
    expect(
      document.querySelector(
        `.js-delivery-option-input-${product1.id}.js-delivery-option-input-${3}`
      ).checked
    ).toBeTrue();
    expect(cart.length).toEqual(2);
    expect(cart[0].deliveryOptionID).toEqual(3);
    expect(shippingPrice).toEqual(formatCurrency(999 + 499));
    expect(totalPrice).toEqual(formatCurrency(1090 + 2095) + shippingPrice);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        {
          productID: product1.id,
          quantity: 1,
          deliveryOptionID: 3,
        },
        {
          productID: product2.id,
          quantity: 1,
          deliveryOptionID: 2,
        },
      ])
    );
  });
  it("does not change delivery option for a productId that is in the cart", () => {
    updateDeliveryOption(product3.id, 3);
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    expect(cart).toEqual([
      {
        productID: product1.id,
        quantity: 1,
        deliveryOptionID: 1,
      },
      {
        productID: product2.id,
        quantity: 1,
        deliveryOptionID: 2,
      },
    ]);
  });
});
