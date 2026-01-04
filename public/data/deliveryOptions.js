import dayjs from "https://esm.sh/dayjs"; // default export, no need for { }
export const deliveryOptions = [
  {
    id: 1,
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: 2,
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: 3,
    deliveryDays: 1,
    priceCents: 999,
  },
];

export function getDeliveryOption(deliveryOptionID) {
  const deliveryOption = deliveryOptions.find((deliveryOption) => {
    return deliveryOption.id === deliveryOptionID;
  });
  return deliveryOption;
}
export function getDeliveryDate(deliveryOption) {
  const today = dayjs();
  let deliveryDate = today.add(deliveryOption.deliveryDays, "days");
  while (deliveryDate.day() === 0 || deliveryDate.day() === 6) {
    deliveryDate = deliveryDate.add(1, "day");
  }
  const dateString = deliveryDate.format("dddd, MMMM D");
  return dateString;
}
