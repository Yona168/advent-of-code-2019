function run(start: number, end: number) {
  let amountWork=0;
  for(let checking=start; checking<=end; checking++){
    const digArr=digits(checking);
    let twoMatch=false;
    let increasing=true;
    for(let i=0; i<digArr.length-1; i++){
      if(digArr[i]===digArr[i+1]){
        //Inner if/else if block is for part 2
        if(i!=0 && digArr[i-1]===digArr[i]){
          continue;
        }else if(i!=digArr.length-2 && digArr[i+2]===digArr[i]){
          continue;
        }
        else twoMatch=true;
      }else if(digArr[i]>digArr[i+1]){
        increasing=false;
      }
    }
    if(twoMatch&&increasing){
      amountWork++;
    }
  }
  return amountWork;
}
function digits(num: number): number[] {
  return [6,5,4,3,2,1].map(it => Math.pow(10, it)).map(it =>( num % it)/(it/10))
  .map(it=>Math.floor(it));
}

export default function(){
  return run(123257, 647015);
}
