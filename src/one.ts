import * as fs from "fs";
import * as path from "path";

const calculateFuel = (mass: number) => Math.max(0, Math.floor(mass / 3 - 2));
//part one
const modules = fs.readFileSync(path.resolve(__dirname, "../data/1.txt"))
  .toString().trim().split(/\r?\n/).map(it => parseInt(it));
const sum = modules.map(calculateFuel).reduce((a, b) => a + b);
console.log(sum);

//part two
let fuelMassSum = 0;
modules.forEach(module => {
  let fuelReq = calculateFuel(module);
  while (fuelReq > 0) {
    fuelMassSum += fuelReq;
    fuelReq = calculateFuel(fuelReq);
  }
})
console.log(fuelMassSum);
