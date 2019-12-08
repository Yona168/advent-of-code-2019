import * as fs from "fs";
import * as path from "path";

export default function() {
  function partOne() {
    const data = fs.readFileSync(path.resolve(__dirname, "../data/6.txt"))
      .toString().trim().split(/\r?\n/);
    const orbits = data.map(line => line.split(")"));
    const initialOrbits = new Map<string, string[]>();
    orbits.forEach(pair => {
      const [mass, orbiter] = [pair[0], pair[1]];
      const existingOrbiterData = initialOrbits.get(orbiter) || [];
      existingOrbiterData.push(mass)
      initialOrbits.set(orbiter, existingOrbiterData)
    });
    function getMassesForOrbiting(orbiter: string, debug: boolean): number {
      const immediate = initialOrbits.get(orbiter);
      if (!immediate) return 0;
      let amt = 0;
      immediate.forEach(mass => {
        amt++;
        amt += getMassesForOrbiting(mass, debug);
      });
      return amt;
    }
    let amount = 0;
    initialOrbits.forEach((_, key) => {
      const allMasses = getMassesForOrbiting(key, false);
      amount += allMasses;
    })
    return amount;
  }

  function partTwo() {
    const data = fs.readFileSync(path.resolve(__dirname, "../data/6.txt"))
      .toString().trim().split(/\r?\n/);
    const orbits = data.map(line => line.split(")"));
    const initialOrbits = new Map<string, string[]>();
    orbits.forEach(pair => {
      const [mass, orbiter] = [pair[0], pair[1]];
      const existingOrbiterData = initialOrbits.get(orbiter) || [];
      existingOrbiterData.push(mass)
      initialOrbits.set(orbiter, existingOrbiterData)
    });
    //Begin new stuff
    orbits.forEach(pair=>{
      const [mass, orbiter]= [pair[0], pair[1]];
      const existingOrbiterData=initialOrbits.get(mass)||[];
      existingOrbiterData.push(orbiter);
      initialOrbits.set(mass, existingOrbiterData);
    })
    //End new stuff

    //This has been edited slightly
    function getAmountSteps(startMass: string, target: string, currentDepth: number, blacklist: string[], debug: boolean): number {
      const immediate = (initialOrbits.get(startMass)||[]).filter(it=>!blacklist.includes(it));
      if(immediate.includes(target)){
        return currentDepth-1;
      } else{
        let amt=0;
        immediate.forEach(mass=>{
          amt+=getAmountSteps(mass, target, currentDepth+1, blacklist.concat([mass]), debug);
        });
        return amt;
      }
    }
    return getAmountSteps("YOU","SAN", 0,[], false);
  }
  return { one: partOne, two: partTwo }
}
