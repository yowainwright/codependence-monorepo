import _ from "lodash";

export const adder = (numbers: Array<number>): number =>
  numbers.reduce((acc, num) => _.add(acc, num), 0);
