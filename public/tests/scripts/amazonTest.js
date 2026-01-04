import { renderProducts } from "../../scripts/amazon.js";
import { Product, Clothing, Appliances } from "../../data/products.js";
describe("test suite: renderProducts", () => {
  const products = [
    {
      id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      image: "images/products/intermediate-composite-basketball.jpg",
      name: "Intermediate Size Basketball",
      rating: {
        stars: 4,
        count: 127,
      },
      priceCents: 2095,
      keywords: ["sports", "basketballs"],
    },
    {
      id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
      image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
      name: "Adults Plain Cotton T-Shirt - 2 Pack",
      rating: {
        stars: 4.5,
        count: 56,
      },
      priceCents: 799,
      keywords: ["tshirts", "apparel", "mens"],
      type: "clothing",
      sizeChartLink: "images/clothing-size-chart.png",
    },
    {
      id: "54e0eccd-8f36-462b-b68a-8182611d9add",
      image: "images/products/black-2-slot-toaster.jpg",
      name: "2 Slot Toaster - Black",
      rating: {
        stars: 5,
        count: 2197,
      },
      priceCents: 1899,
      keywords: ["toaster", "kitchen", "appliances"],
      type: "appliance",
      instructionsLink: "images/appliance-instructions.png",
      warrantyLink: "images/appliance-warranty.png",
    },
  ].map((item) => {
    if (item.type === "clothing") {
      return new Clothing(item);
    } else if (item.type === "appliance") {
      return new Appliances(item);
    } else {
      return new Product(item);
    }
  });
  function getProductEl(id) {
    return document.querySelector(`[data-product-id="${id}"]`);
  }
  beforeEach(() => {
    document.querySelector(
      ".js-test-container"
    ).innerHTML = `<section class="products-grid js-products-grid"> </section>`;
    renderProducts(products);
  });
  afterEach(() => {
    document.querySelector(".js-test-container").innerHTML = ``;
  });
  it("displays products grid", () => {
    products.forEach((product) => {
      const el = getProductEl(product.id);

      expect(el.querySelector(".js-product-name").innerText).toContain(
        product.name
      );

      expect(el.querySelector(".js-product-price").innerText).toContain(
        `$${product.getPrice()}`
      );
    });
  });
  it("shows size chart for clothing products", () => {
    const clothing = products.find((p) => p instanceof Clothing);
    const el = getProductEl(clothing.id);

    expect(el.querySelector(".js-extra-product-info").innerText).toContain(
      "Size Chart"
    );
  });
  it("shows instructions and warranty for appliances", () => {
    const appliance = products.find((p) => p instanceof Appliances);
    const el = getProductEl(appliance.id);

    expect(el.querySelector(".js-extra-product-info").innerText).toContain(
      "Instructions"
    );

    expect(el.querySelector(".js-extra-product-info").innerText).toContain(
      "Warranty"
    );
  });

  it("shows no extra info for base products", () => {
    const base = products.find((p) => p instanceof Product);
    const el = getProductEl(base.id);

    expect(el.querySelector(".js-extra-product-info").innerText).toBe("");
  });
});
