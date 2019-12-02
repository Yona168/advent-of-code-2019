import * as fs from "fs";
import * as path from "path";

export default function() {
  const orig = fs.readFileSync(path.resolve(__dirname, "../data/2.txt")).toString().trim().split(",")
    .map(it => parseInt(it));

  function runWith(noun: number, verb: number) {
    const data = orig.slice();
    data[1] = noun;
    data[2] = verb;
    let opcodePos = 0;
    while (data[opcodePos] != 99 && opcodePos < data.length) {
      const [opcode, inputOne, inputTwo, output] =
        [data[opcodePos], data[data[opcodePos + 1]], data[data[opcodePos + 2]], data[opcodePos + 3]];
      const result = opcode == 1 ? inputOne + inputTwo : inputOne * inputTwo;
      data[output] = result;
      opcodePos += 4
    }
    return data[0];
  }

  const partOne=()=>runWith(12, 2);

  function partTwo(){
    for(let noun=0; noun<=99; noun++){
      for(let verb=0; verb<=99; verb++){
        const result=runWith(noun, verb);
        if(result===19690720){
          return 100*noun+verb;
        }
      }
    }
  }
}
