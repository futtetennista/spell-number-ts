import * as fc from "fast-check";

import translate from "./app";

const validRange = { low: 1, up: 1000 };

describe("Number to string", () => {
  test("The word 'hundred' appears when it should", () => {
    fc.assert(
      fc.property(fc.integer({ min: 100, max: 999 }), (i) => {
        const translation = translate(validRange, i.toString());
        return translation.type === "success"
          ? translation.content.split(" ").filter((e) => e === "hundred")
              .length === 1
          : false;
      })
    );
  });

  test("The word 'hundred' doesn't appears when it should not", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 99 }), (i) => {
        const translation = translate(validRange, i.toString());
        return translation.type === "success"
          ? translation.content.split(" ").filter((e) => e === "hundred")
              .length === 0
          : false;
      })
    );
  });

  test("An invalid number is never translated", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1001, max: 2000 }),
        (i) => translate(validRange, i.toString()).type === "error"
      )
    );
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 0 }),
        (i) => translate(validRange, i.toString()).type === "error"
      )
    );
  });

  test("A valid number is always translated", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        (i) => translate(validRange, i.toString()).type === "success"
      )
    );
  });
});
