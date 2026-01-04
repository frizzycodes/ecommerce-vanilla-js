import { formatCurrency } from "../../../scripts/utils/money.js";

describe("test suite: formatCurrency", () => {
  it("converts cents into dollars", () => {
    expect(formatCurrency(2045)).toEqual("20.45");
  });
  it("works for 0", () => {
    expect(formatCurrency(0)).toEqual("0.00");
  });
  it("rounds up to near cent", () => {
    expect(formatCurrency(2000.4)).toEqual("20.00");
    expect(formatCurrency(2000.5)).toEqual("20.01");
  });
  it("handles negative price", () => {
    expect(formatCurrency(-1000)).toEqual("0.00");
  });
});
