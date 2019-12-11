import * as fs from "fs";
import * as path from "path";

const getData = () => fs.readFileSync(path.resolve(__dirname, "../data/10.txt")).toString().trim().split(/\r?\n/)
  .map(row => row.split(""))

export default function() {
  function one() {
    const data = getData();
    function getVisibleFor(row: number, column: number): number {
      interface Slope {
        dy: number,
        dx: number,
        negative: boolean
      }
      interface Asteroid {
        slope: Slope,
        counter: number,
        leftTopQuadrant: boolean
      }
      function reduce(slope: Slope): Slope {
        function gcd(a: number, b: number) {
          return b ? gcd(b, a % b) : a;
        };
        const result = gcd(slope.dy, slope.dx);
        return { dy: slope.dy / result, dx: slope.dx / result, negative: slope.negative };
      }
      const slopes: (Asteroid | undefined)[] = [];
      let counter = 0;
      for (let r = 0; r < data.length; r++) {
        for (let c = 0; c < data[0].length; c++) {
          if (data[r][c] === ".") continue;
          if (r === row && c === column) continue;
          counter++;
          const dy = (data.length - r) - (data.length - row);
          const dx = c - column;
          const slope: Slope = dx === 0 ? undefined : reduce(
            { negative: dy !== 0 && ((dy < 0 || dx < 0) && !(dy < 0 && dx < 0)), dy: Math.abs(dy), dx: Math.abs(dx) });
          const leftTopQuadrant = (c === column ? r < row : c < column)
          if (slopes.filter(it => (it.slope === undefined && slope === undefined && it.leftTopQuadrant === leftTopQuadrant) ||
            (it.slope !== undefined && slope !== undefined && it.slope.dx === slope.dx && it.slope.dy === slope.dy && it.slope.negative === slope.negative && it.leftTopQuadrant === leftTopQuadrant)).length !== 1) {
            slopes.push({ slope: slope, leftTopQuadrant: leftTopQuadrant, counter: counter });
          }
        }
      }
      return slopes.length;
    }

    const visibles: number[] = [];
    for (let r = 0; r < data.length; r++) {
      for (let c = 0; c < data[0].length; c++) {
        if (data[r][c] == "#") {
          visibles.push(getVisibleFor(r, c));
        }
      }
    }
    return visibles.sort((a, b) => b - a)[0];
  }

  function two() {
    /*DOESNT WORK YET*/
    const data = getData();
    interface Slope {
      dy: number,
      dx: number,
      negative: boolean
    }
    interface Asteroid {
      slope: Slope,
      counter: number,
      leftTopQuadrant: boolean,
      coords: [number, number],
      manhattanDistance: number
    }
    function reduce(slope: Slope): Slope {
      function gcd(a: number, b: number) {
        return b ? gcd(b, a % b) : a;
      };
      const result = gcd(slope.dy, slope.dx);
      return { dy: slope.dy / result, dx: slope.dx / result, negative: slope.negative };
    }
    function getAsteroidsBySlopeAndDistance(row: number, column: number): Map<boolean, Map<number, Map<number, Asteroid[]>>> {
      const returning: Map<boolean, Map<number, Map<number, Asteroid[]>>> = new Map();
      let counter = 0;
      for (let r = 0; r < data.length; r++) {
        for (let c = 0; c < data[0].length; c++) {
          if (data[r][c] === ".") continue;
          if (r === row && c === column) continue;
          counter++;
          const dy = (data.length - r) - (data.length - row);
          const dx = c - column;
          const slope: Slope | undefined = dx === 0 ? undefined : reduce(
            { negative: dy !== 0 && ((dy < 0 || dx < 0) && !(dy < 0 && dx < 0)), dy: Math.abs(dy), dx: Math.abs(dx) });
          const leftTopQuadrant = (c === column ? r < row : c < column)
          const asteroid: Asteroid = { slope: slope, coords: [r, c], leftTopQuadrant: leftTopQuadrant, counter: counter, manhattanDistance: Math.abs(dx) + Math.abs(dy) };
          const safeDy = (asteroid.slope === undefined ? undefined : Math.abs(asteroid.slope.dy)) * (asteroid.slope !== undefined && asteroid.slope.negative ? -1 : 1);
          const safeDx = asteroid.slope === undefined ? undefined : Math.abs(asteroid.slope.dx);
          const yMap = returning.get(asteroid.leftTopQuadrant) || new Map();
          const xMap = yMap.get(safeDy) || new Map();
          const otherAsteroids: Asteroid[] = xMap.get(safeDx) || [];
          otherAsteroids.push(asteroid);
          otherAsteroids.sort((a, b) => a.manhattanDistance - b.manhattanDistance)
          xMap.set(safeDx, otherAsteroids);
          yMap.set(safeDy, xMap)
          returning.set(leftTopQuadrant, yMap);
        }
      }
      return returning;
    }

    function getCoordsOf200th(): [number, number] {
      const [idealRow, idealColumn] = [19, 27]
      const asteroidsBySlope = getAsteroidsBySlopeAndDistance(idealRow, idealColumn);
      let incineratedCounter = 0;
      function incinerateAtSlope(slope: Slope, leftTop: boolean): [number, number] | undefined {
        const reduced = reduce(slope);
        let [dy, dx] = [reduced.dy, reduced.dx];
        if (dy === -0) dy = 0;
        if (dx < 0 && dy >= 0) {
          dy = (dy === 0) ? 0 : -dy;
          dx = -dx;
        }

        const asteroidsSameRegion: Map<number, Map<number, Asteroid[]>> = asteroidsBySlope.get(leftTop);
        const yMap = (asteroidsSameRegion.get(dy) || new Map());
        const asteroidsWithThisSlope: Asteroid[] = yMap.get(dx);
        if (!asteroidsWithThisSlope || asteroidsWithThisSlope.length === 0) return undefined;
        else {
          console.log("Burned: ")
          console.log(`${dy}/${dx} at ${incineratedCounter}`)
          incineratedCounter++;
          const victim = asteroidsWithThisSlope.shift();
          yMap.set(dx, asteroidsWithThisSlope);
          asteroidsSameRegion.set(dy, yMap);
          asteroidsBySlope.set(leftTop, asteroidsSameRegion);
          return victim.coords;
        }
      }
      while (incineratedCounter < 200) {
        console.log("START")
        let [currentDx, currentDy] = [0, 0];
        const [maxDx, maxDy] = [data[0].length - idealColumn, data.length - idealRow];
        const [minDx, minDy] = [-idealColumn, -idealRow];
        //First quadrant
        while (currentDy <= maxDy) {
          while (currentDx <= maxDx) {
            //Negative doesn't matter here-dy is negative if need be.
            const coords = incinerateAtSlope({ dx: currentDx, dy: currentDy, negative: true }, (currentDy > 0 && currentDx === 0));
            if (incineratedCounter === 200) {
              return coords;
            }
            currentDx++;
          }
          currentDx = 0;
          currentDy++;
        }
        //Second quadrant
        currentDy = 0;
        currentDx = 0;
        while (currentDy <= maxDy) {
          while (currentDx >= minDx) {
            const coords = incinerateAtSlope({ dx: currentDx, dy: currentDy, negative: true }, true);
            if (incineratedCounter === 200) {
              return coords;
            }
            currentDx--;
          }
          currentDx = 0;
          currentDy++;
        }
        //Third quadrant
        currentDy = 0;
        currentDx = 0;
        while (currentDy >= minDy) {
          while (currentDx >= minDx) {
            const coords = incinerateAtSlope({ dx: currentDx, dy: currentDy, negative: true }, true);
            if (incineratedCounter === 200) {
              return coords;
            }
            currentDx--;
          }
          currentDx = 0;
          currentDy--;
        }
        //Fourth quadrant
        currentDy = 0;
        currentDx = 0;
        while (currentDy >= minDy) {
          while (currentDx <= maxDx) {

            const coords = incinerateAtSlope({ dx: currentDx, dy: currentDy, negative: true }, false);
            if (incineratedCounter === 200) {
              return coords;
            }
            currentDx++;
          }
          currentDy--;
          currentDx = 0;
        }
      }

    }
    const coords = getCoordsOf200th();
    return coords[1] * 100 + coords[0]

  }
  return { one: one, two: two }
}
