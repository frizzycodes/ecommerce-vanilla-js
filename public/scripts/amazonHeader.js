export function getAmazonHeader() {
  return document.querySelector(".js-amazon-header");
}
export function handleAmazonHeaderClick(event) {
  const amazonHeader = getAmazonHeader();
  if (!amazonHeader) return;
  const dropDownBtn = event.target.closest(".js-hamburger-menu");
  if (dropDownBtn) {
    const dropDownElem = amazonHeader.querySelector(".header-nav-links");
    dropDownElem.classList.toggle("istoggled");
    return;
  }
}
