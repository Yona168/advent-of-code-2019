import * as fs from "fs";
import * as path from "path";

export default function() {
  const data = fs.readFileSync(path.resolve(__dirname, "../data/5.txt")).toString().trim().split(",")
    .map(it => parseInt(it));
  function partOne() {
    let opcodePos = 0;
    while (data[opcodePos] != 99 && opcodePos < data.length) {
      const digits = getDigits(data[opcodePos]);
      const opcode = digits[digits.length - 1]
      if (opcode == 3 || opcode == 4) {
        const locAddress = data[opcodePos + 1];
        if (opcode == 3) data[locAddress] = 1; else console.log(data[locAddress]);
        opcodePos += 2;
        continue;
      } else if (opcode == 1 || opcode == 2) {
        const paramInfo = digits.slice(0, digits.length - 2).reverse();
        const one = paramInfo[0] == 1 ? data[opcodePos + 1] : data[data[opcodePos + 1]];
        const two = paramInfo[1] == 1 ? data[opcodePos + 2] : data[data[opcodePos + 2]];
        const result = opcode == 1 ? one + two : one * two;
        data[data[opcodePos + 3]] = result;
        opcodePos += 4;
        continue;
      } else {
        console.log("oof. Opcode was " + opcode);
        break;
      }
    }
    return "done";
  }

  function partTwo() {
    let opcodePos = 0;
    while (data[opcodePos] != 99 && opcodePos < data.length) {
      const digits = getDigits(data[opcodePos]);
      const opcode = digits[digits.length - 1];
      if (opcode == 3 || opcode == 4) {
        const locAddress = data[opcodePos + 1];
        if (opcode == 3) data[locAddress] = 5; else console.log(data[locAddress]);
        opcodePos += locAddress == opcodePos ? 0 : 2;
        continue;
      } else if ((opcode >= 1 && opcode < 3) || (opcode > 4 && opcode <= 8)) {
        const paramInfo = digits.slice(0, digits.length - 2).reverse();
        const one = paramInfo[0] == 1 ? data[opcodePos + 1] : data[data[opcodePos + 1]];
        const two = paramInfo[1] == 1 ? data[opcodePos + 2] : data[data[opcodePos + 2]];
        let result: number;
        if (opcode == 1) result = one + two;
        else if (opcode == 2) result = one * two;
        else if (opcode == 5 || opcode == 6) {
          if (opcode == 5) {
            if (one !== 0) opcodePos = two;
            else opcodePos+=3
          } else if (one === 0) opcodePos = two; else opcodePos+=3
          continue;
        } else {
          if (opcode == 7)
            result = one < two ? 1 : 0;
          else result = one == two ? 1 : 0;
        }
        const locAddress = data[opcodePos + 3];
        data[locAddress] = result;
        opcodePos += locAddress == opcodePos ? 0 : 4;
        continue;
      } else {
        console.log("oof. Opcode was " + opcode);
        break;
      }
    }
    return "done";
  }
  return {
    one: partOne,
    two: partTwo
  }
}

function getDigits(num: number) {
  return Array.from({ length: num.toString().length }, (_, k) => k + 1).map(it => Math.pow(10, it)).map(it => (num % it) / (it / 10))
    .map(it => Math.floor(it)).reverse();
}
