import { cart } from "../data/cart.js";
import { products, loadProducts } from "../data/products.js";
import { getAmazonHeader, handleAmazonHeaderClick } from "./amazonHeader.js";
import { searchProducts, updateSearchParam } from "../scripts/utils/search.js";
function getProductsGrid() {
  return document.querySelector(".js-products-grid");
}
const cartToast = {
  timeouts: {},

  show(productId) {
    const toastElem = document.querySelector(
      `.js-add-to-cart-toast-${productId}`
    );
    if (!toastElem) return;

    if (this.timeouts[productId]) clearTimeout(this.timeouts[productId]);

    toastElem.classList.add("istoggled");
    this.timeouts[productId] = setTimeout(() => {
      toastElem.classList.remove("istoggled");
      delete this.timeouts[productId];
    }, 2000);
  },
};

export function renderProducts(products) {
  if (!Array.isArray(products) || products.length === 0) {
    return;
  }
  const productsGrid = getProductsGrid();
  if (!productsGrid) return;
  let productsHtml = "";
  products.forEach((product) => {
    productsHtml += `
            <div class="product-container" data-product-id = "${product.id}">
                <div class="product-image-container">
                    <img class="product-image" src="/${product.image}" alt="">
                </div>
                <div class="product-name js-product-name limit-to-2-lines">
                    ${product.name}
                </div>
                <div class="product-raiting-container">
                    <img class="product-raiting-stars" src="/${product.getRatingStarsUrl()}" alt="">
                    <div class="product-raiting-count">
                        ${product.rating.count}
                    </div>
                </div>
                <div class="product-price js-product-price">
                    $${product.getPrice()}
                </div>
                <div class="product-quantity-container">
                    <select class="js-cart-quantity-selector-${product.id}">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
                <div class="add-to-cart-toast js-add-to-cart-toast-${
                  product.id
                }">
                    <img src="/images/icons/checkmark.png" alt=""> Added
                </div>
                <div class="add-to-cart-button js-add-to-cart" data-product-id="${
                  product.id
                }">
                    Add to Cart
                </div>
                <div class = "extra-product-info js-extra-product-info">
                    ${product.extraInfoHTML()}
                </div>
            </div>
        `;
  });
  productsGrid.innerHTML = productsHtml;
}
export function searchAndRenderProducts(query) {
  const results = searchProducts(query);
  if (results.length > 0) {
    renderProducts(results);
  } else {
    noProductsFound();
  }
  updateSearchParam(query);
}
function noProductsFound() {
  const grid = getProductsGrid();
  if (!grid) return;
  grid.innerHTML = `<p class="no-results">
    No products matched your search.
  </p>`;
}
function handleProductGridClick(event) {
  // --- Add to Cart --- //
  const addToCartBtn = event.target.closest(".js-add-to-cart");
  if (addToCartBtn) {
    const productId = addToCartBtn.dataset.productId;
    const cartQuantityElem = document.querySelector(".js-cart-quantity");
    const itemQuantity = Number(
      document.querySelector(`.js-cart-quantity-selector-${productId}`).value
    );
    cart.addToCart(productId, itemQuantity);
    cart.updateCartQuantity(cartQuantityElem);
    cartToast.show(productId);
    return;
  }
}
function setupAmazonPage() {
  const productsGrid = getProductsGrid();
  const amazonHeader = getAmazonHeader();
  const form = document.querySelector(".js-search-form");
  const cartQuantityElem = document.querySelector(".js-cart-quantity");
  cart.updateCartQuantity(cartQuantityElem);
  if (productsGrid) {
    productsGrid.addEventListener("click", handleProductGridClick);
  }
  if (amazonHeader) {
    amazonHeader.addEventListener("click", handleAmazonHeaderClick);
    amazonHeader.addEventListener("click", (event) => {
      const searchButton = event.target.closest(".js-search-button");
      if (!searchButton) return;

      const searchBar = amazonHeader.querySelector(".js-search-bar");
      const query = searchBar.value;

      searchAndRenderProducts(query);
    });
  }
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // 🔥 STOP browser submission
      console.log("AMAZON FORM SUBMIT");
      const searchBar = form.querySelector(".js-search-bar");
      const query = searchBar.value;

      searchAndRenderProducts(query);
      updateSearchParam(query);
    });
  }
  window.addEventListener("popstate", async () => {
    await cart.loadCart(); // re-read from storage / backend
    cart.updateCartQuantity(document.querySelector(".js-cart-quantity"));
    const params = new URLSearchParams(window.location.search);
    const query = params.get("search");
    console.log("POPPEd");

    if (query) {
      searchAndRenderProducts(query);
    } else {
      renderProducts(products);
    }
  });
}
async function initAmazonPage() {
  await Promise.all([loadProducts(), cart.loadCart()]);

  const params = new URLSearchParams(window.location.search);
  const queryFromUrl = params.get("search");

  if (queryFromUrl) {
    searchAndRenderProducts(queryFromUrl);
  } else {
    renderProducts(products);
  }
  setupAmazonPage();
}

initAmazonPage();
