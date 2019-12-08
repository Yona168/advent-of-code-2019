import * as fs from "fs";
import * as path from "path";

const data = fs.readFileSync(path.resolve(__dirname, "../data/7.txt")).toString().trim().split(",")
  .map(it => parseInt(it));
export default function() {
  function partOne() {
    function runComputer(phaseSetting: number, previous: number): number {
      let opcodePos = 0;
      let didSetPhaseSetting = false;
      while (data[opcodePos] != 99 && opcodePos < data.length) {
        const digits = getDigits(data[opcodePos]);
        const opcode = digits[digits.length - 1];
        if (opcode == 3 || opcode == 4) {
          const locAddress = data[opcodePos + 1];
          if (opcode == 3) {
            data[locAddress] = didSetPhaseSetting ? previous : phaseSetting;
            if (!didSetPhaseSetting) didSetPhaseSetting = true;
          }
          else return data[locAddress]
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
              else opcodePos += 3
            } else if (one === 0) opcodePos = two; else opcodePos += 3
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
      return -1;
    }
    const phaseSettings = [0, 1, 2, 3, 4];
    const possiblePermutations = permutator(phaseSettings);
    function runAmps(settings: number[]) {
      let lastOutput = 0;
      settings.forEach(setting => lastOutput = runComputer(setting, lastOutput));
      return lastOutput;
    }
    const results = possiblePermutations.map(runAmps);
    return results.sort((a, b) => b - a)[0];
  }

  function partTwo() {
    interface Memory {
      data: number[],
      pc: number
    }
    interface Amp {
      memory: Memory,
      output: number,
      phaseSetting?: number,
      run(phaseSetting: number, use0: boolean, prev?: Amp): number
    }
    function createAmp(): Amp {
      return {
        memory: {
          data: data.slice(),
          pc: 0
        },
        output: 0,
        run(phaseSetting: number, use0: boolean, prev: Amp) {
          while (this.memory.pc < this.memory.data.length) {
            if (this.memory.data[this.memory.pc] == 99) {
              return this.output;
            }
            const digits = getDigits(this.memory.data[this.memory.pc]);
            const opcode = digits[digits.length - 1];
            if (opcode == 3 || opcode == 4) {
              const locAddress = this.memory.data[this.memory.pc + 1];
              if (opcode == 3) {
                if (!this.phaseSetting) {
                  this.memory.data[locAddress] = phaseSetting;
                  this.phaseSetting = phaseSetting;
                } else {
                  this.memory.data[locAddress] = use0 ? 0 : prev.output;
                }
                this.memory.pc += locAddress == this.memory.pc ? 0 : 2;
              }
              else {
                this.output = this.memory.data[locAddress];
                this.memory.pc += 2
                return -1;
              }
              continue;
            } else if ((opcode >= 1 && opcode < 3) || (opcode > 4 && opcode <= 8)) {
              const paramInfo = digits.slice(0, digits.length - 2).reverse();
              const one = paramInfo[0] == 1 ? this.memory.data[this.memory.pc + 1] : this.memory.data[this.memory.data[this.memory.pc + 1]];
              const two = paramInfo[1] == 1 ? this.memory.data[this.memory.pc + 2] : this.memory.data[this.memory.data[this.memory.pc + 2]];
              let result: number;
              if (opcode == 1) result = one + two;
              else if (opcode == 2) result = one * two;
              else if (opcode == 5 || opcode == 6) {
                if (opcode == 5) {
                  if (one !== 0) this.memory.pc = two;
                  else this.memory.pc += 3
                } else if (one === 0) this.memory.pc = two; else this.memory.pc += 3
                continue;
              } else {
                if (opcode == 7)
                  result = one < two ? 1 : 0;
                else result = one == two ? 1 : 0;
              }
              const locAddress = this.memory.data[this.memory.pc + 3];
              this.memory.data[locAddress] = result;
              this.memory.pc += locAddress == this.memory.pc ? 0 : 4;
              continue;
            } else {
              console.log("oof. Opcode was " + opcode);
              break;
            }
          }
          return this.output;
        }
      }
    }

    function runAmps(settings: number[]) {
      const amps = [1, 2, 3, 4, 5].map(_ => createAmp());
      let counter = 0;
      let firstLoop = true;
      while (true) {
        const result = amps[counter].run(settings[counter], firstLoop && counter == 0, counter == 0 ? amps[amps.length - 1] : amps[counter - 1]);
        if (result !== -1 && counter == amps.length - 1) {
          return result;
        }
        counter++;
        if (counter == amps.length) { counter = 0; firstLoop = false; }
      }
    }
    const phaseSettings = [5, 6, 7, 8, 9];
    const permutations = permutator(phaseSettings);
    return permutations.map(runAmps).sort((a, b) => b - a)[0];
  }

  return { one: partOne, two: partTwo }
}

function getDigits(num: number) {
  return Array.from({ length: num.toString().length }, (_, k) => k + 1).map(it => Math.pow(10, it)).map(it => (num % it) / (it / 10))
    .map(it => Math.floor(it)).reverse();
}

const permutator = (inputArr: number[]): number[][] => {
  let result = [];
  const permute = (arr: number[], m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
      }
    }
  }
  permute(inputArr)
  return result;
}
