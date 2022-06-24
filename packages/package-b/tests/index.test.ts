import { test, expect } from "vitest";
import { adder } from "../src/index";

test("rambda adder", () => {
  const result = adder([1, 2, 3]);
  expect(result).toEqual(6);
});
