import * as fs from "fs";
import * as path from "path";

const data = fs.readFileSync(path.resolve(__dirname, "../data/8.txt")).toString().trim().split("")
  .map(it => parseInt(it));

export default function() {
  function one() {
    const amountLayers = Math.ceil(data.length / (25 * 6));
    const img: number[][][] = [];
    let counter = 0;
    for (let layer = 0; layer < amountLayers; layer++) {
      img[layer]=[];
      for (let r = 0; r < 25; r++) {
        img[layer][r]=[];
        for (let c = 0; c < 6; c++) {
          img[layer][r][c] = data[counter];
          counter++;
        }
      }
    }
    const layer = img.sort((a, b) => countZeros(a) - countZeros(b))[0];
    return count(layer, 1)*count(layer, 2);
  }
  function two() {
    const amountLayers = Math.ceil(data.length / (25 * 6));
    const img: number[][][] = [];
    let counter = 0;
    for (let layer = 0; layer < amountLayers; layer++) {
      img[layer]=[];
      for (let r = 0; r < 6; r++) {
        img[layer][r]=[];
        for (let c = 0; c < 25; c++) {
          img[layer][r][c] = data[counter];
          counter++;
        }
      }
    }
    const newImg: number[][]=[];
    for(let r=0; r<6; r++){
      newImg[r]=[];
      for(let c=0; c<25; c++){
        let layerChecker=0;
        while(img[layerChecker][r][c]===2){
          layerChecker++;
        }
        newImg[r][c]=img[layerChecker][r][c];
      }
    }
    for(let r=0; r<6; r++){
      console.log("\n");
      for(let c=0; c<25; c++){
        const str=newImg[r][c]===1 ? "#":"."
        process.stdout.write(str)
      }
    }
  }
  return { one: one, two: two };
}



function howMany(input: number[], target: number) {
  return input.filter(it => it === target).length;
}
function count(input: number[][], target: number) {
  return howMany(input.reduce((prev = [], cur) => prev.concat(cur)), target);
}
function countZeros(input: number[][]) {
  return count(input, 0);
}
