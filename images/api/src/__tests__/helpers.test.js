const {checkBrandName} = require("../helpers/endpointHelpers")

test("Check Brand", () => {
    expect(checkBrandName("")).toBe(false);
})