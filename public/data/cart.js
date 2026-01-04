class Cart {
  cartItems = [];
  async addToCart(productId, quantity = 1) {
    const matchingCartItem = this.cartItems.find((item) => {
      return item.productID === productId;
    });
    if (matchingCartItem) {
      matchingCartItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productID: productId,
        quantity,
        deliveryOptionID: 1,
      });
    }
    await this.saveCart();
  }
  async deleteCartItem(productID) {
    this.cartItems = this.cartItems.filter(
      (item) => item.productID !== productID
    );
    await this.saveCart();
  }
  updateCartQuantity(cartQuantityElem) {
    if (!cartQuantityElem) return;
    let cartQuantity = 0;
    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    cartQuantityElem.innerHTML = cartQuantity;
  }
  updateCartItemQuantity(productID, newQuantity) {
    this.cartItems.forEach((cartItem) => {
      if (cartItem.productID === productID) {
        cartItem.quantity = newQuantity;
      }
    });
    this.saveCart().catch(console.error);
  }
  updateDeliveryOption(productID, deliveryOptionID) {
    const matchingCartItem = this.cartItems.find((item) => {
      return item.productID === productID;
    });
    if (!matchingCartItem) {
      return;
    }
    matchingCartItem.deliveryOptionID = deliveryOptionID;
    this.saveCart().catch(console.error);
  }
  async loadCart() {
    try {
      const res = await fetch("http://localhost:3000/api/cart");
      // HTTP error handling (xhr.status check)
      if (!res.ok) {
        throw new Error(`Failed to load cart (${res.status})`);
      }
      // Equivalent of xhr.responseType = "json"
      const data = await res.json();

      this.cartItems = data.items || [];
      console.log("Cart Loaded");
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Network error while loading cart"
      );
    }
  }
  async saveCart() {
    try {
      const res = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: this.cartItems }),
      });
      if (!res.ok) {
        throw new Error(`Failed to save cart (${res.status})`);
      }
      console.log("Cart Saved");
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Network error while saving cart"
      );
    }
  }
  /*saveCart() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener("error", () => {
        reject(new Error("Network error while saving cart"));
      });
      xhr.addEventListener("load", () => {
        if (xhr.status !== 200 && xhr.status !== 201) {
          reject(new Error("Network error while saving cart"));
          return;
        }

        resolve();
      });
      xhr.open("POST", "http://localhost:3000/api/cart");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(
        JSON.stringify({
          items: this.cartItems,
        })
      );
    });
  }
  */
}

export const cart = new Cart();
