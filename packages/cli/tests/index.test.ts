import { test, expect } from "vitest";
import { action } from "../src/index";

test("action", () => {
  const result: any = action({ isTesting: true });
  console.log({ result });
  expect(result?.codependence).toBeDefined();
});
