const {checkBrandName} = require("../helpers/endpointHelpers")

test("Check Brand", () => {
    expect(checkBrandName("")).toBe(false);
    expect(checkBrandName(null)).toBe(false);
    expect(checkBrandName("i")).toBe(false);
    expect(checkBrandName(0)).toBe(false);
    expect(checkBrandName("Dior")).toBe(true);
    expect(checkBrandName("R.E.M. Beauty")).toBe(true);
})