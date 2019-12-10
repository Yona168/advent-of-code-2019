import * as fs from "fs";
import * as path from "path";

export default function() {
  const getData = () => fs.readFileSync(path.resolve(__dirname, "../data/9.txt")).toString().trim().split(",")
    .map(it => parseInt(it));
  function run(input: number) {
    const data=getData();
    let relBase=0;
    let opcodePos = 0;
    let begin=false;
    while (data[opcodePos] != 99 && opcodePos < data.length) {
      if(begin)console.log(opcodePos, relBase)
      const digits = getDigits(data[opcodePos]);
      const paramInfo = digits.slice(0, digits.length - 2).reverse();
      const opcode = digits[digits.length - 1];
      if (opcode == 3 || opcode == 4) {
        if(opcode===3){
          const locAddress = data[opcodePos + 1];
          data[locAddress+(paramInfo[0]===2 ? relBase:0)] =input;
          opcodePos+=(locAddress===opcodePos? 0:2);
        } else{
          const locAddress=data[opcodePos+1];
          const logging=paramInfo[0]===1 ? locAddress: data[locAddress+(paramInfo[0]===2 ? relBase:0)];
          console.log(logging);
          if(logging===99){
            begin=true;
          }
          opcodePos+=2;
        }
      } else if ((opcode >= 1 && opcode < 3) || (opcode > 4 && opcode <= 9)) {
        const one = paramInfo[0] == 1 ? data[opcodePos + 1] : data[data[opcodePos + 1] +( paramInfo[0]===2 ? relBase:0)];
        const two = paramInfo[1] == 1 ? data[opcodePos + 2] : data[data[opcodePos + 2] + (paramInfo[1]===2 ? relBase:0)];
        let result: number;
        if (opcode == 1) result = one + two;
        else if (opcode == 2) result = one * two;
        else if (opcode == 5 || opcode == 6) {
          if (opcode == 5) {
            if (one !== 0) opcodePos = two;
            else opcodePos+=3
          } else if (one === 0) opcodePos = two; else opcodePos+=3
          continue;
        }else if(opcode===9){
          relBase+=(paramInfo[0]===1 ? data[opcodePos+1]: data[data[opcodePos+1]+(paramInfo[0]===2 ? relBase: 0)]);
          opcodePos+=2;
          continue;
        } else {
          if (opcode == 7)
            result = one < two ? 1 : 0;
          else result = one == two ? 1 : 0;
        }
        const locAddress = data[opcodePos + 3];
        data[locAddress + (paramInfo[2]===2 ? relBase: 0)] = result;
        opcodePos += (locAddress == opcodePos ? 0 : 4);
        continue;
      } else {
        console.log("oof. Opcode was " + opcode);
        break;
      }
    }
    return "done";
  }
  return { one: ()=>run(1), two: ()=>run(2) }
}

function getDigits(num: number) {
  return Array.from({ length: num.toString().length }, (_, k) => k + 1).map(it => Math.pow(10, it)).map(it => (num % it) / (it / 10))
    .map(it => Math.floor(it)).reverse();
}
