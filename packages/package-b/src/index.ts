import { add } from "rambda";

export const adder = (numbers: Array<number>): number =>
  numbers.reduce((acc, num) => add(acc)(num), 0);
