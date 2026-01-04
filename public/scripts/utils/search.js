import { products } from "../../data/products.js";

export function searchProducts(query) {
  if (!products.length) return; // return if products are not loaded
  console.log("search Called");
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return products; // return if products are not loaded
  }
  const filtered = products.filter((product) => {
    if (product.name.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    /*let match = false;
    for (const keyword of product.keywords) {
      if (keyword.toLowerCase().includes(normalizedQuery)) {
        match = true;
        break;
      }
    }
    return match;*/

    return product.keywords.some((keyword) => {
      return keyword.toLowerCase().includes(normalizedQuery);
    });
  });
  return filtered;
}
export function updateSearchParam(query) {
  const params = new URLSearchParams(window.location.search);
  if (query) {
    params.set("search", query);
  } else {
    params.delete("search");
  }

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, "", newUrl);
}
