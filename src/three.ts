import * as fs from "fs";
import * as path from "path";

export default function() {
  enum Direction {
    RIGHT,
    LEFT,
    UP,
    DOWN
  }
  function directionFrom(char: string): Direction {
    switch (char) {
      case "D": return Direction.DOWN;
      case "U": return Direction.UP;
      case "L": return Direction.LEFT;
      case "R": return Direction.RIGHT;
      default: throw new Error("Unknown direction!")
    }
  }
  interface Step {
    direction: Direction,
    magnitude: number
  }
  function getSteps(str: string): Step[] {
    return str.split(",").map(it => {
      return {
        direction: directionFrom(it.charAt(0)),
        magnitude: parseInt(it.substring(1, it.length))
      }
    })
  }
  interface Coords {
    x: number,
    y: number
  }
  function getIntersectionsAndCombinedSteps(steps: Step[][]): [Coords[], number[]] {
    const statusMap = new Map<number, Map<number, number[]>>();
    const intersectionCoords = []
    const stepsToIntersection = [];
    function processSteps(steps: Step[], wireNumber: number): void {
      let [offsetx, offsety] = [0, 0];
      let amountSteps = 0;
      function push() {
        const xMap = statusMap.get(offsety) || new Map();
        let status: number[] | undefined = xMap.get(offsetx);
        if (status !== undefined && status.length > 0 && status[wireNumber] === undefined) {
          intersectionCoords.push({ x: offsetx, y: offsety });
          stepsToIntersection.push(status[0] + amountSteps);
        } else {
          if (!status) status = [];
          status[wireNumber] = amountSteps;
          xMap.set(offsetx, status);
        }
        statusMap.set(offsety, xMap);
      }
      steps.forEach((step) => {
        if (step.direction === Direction.UP) {
          const newGoal = offsety + step.magnitude;
          for (; offsety < newGoal; offsety++) {
            push();
            amountSteps++;
          }
        } else if (step.direction === Direction.DOWN) {
          const newGoal = offsety - step.magnitude;
          for (; offsety > newGoal; offsety--) {
            push();
            amountSteps++;
          }
        } else if (step.direction === Direction.RIGHT) {
          const newGoal = offsetx + step.magnitude;
          for (; offsetx < newGoal; offsetx++) {
            push();
            amountSteps++;
          }
        } else {
          const newGoal = offsetx - step.magnitude;
          for (; offsetx > newGoal; offsetx--) {
            push();
            amountSteps++;
          }
        }
      });
    }
    steps.forEach((stepArr, index) => processSteps(stepArr, index));
    return [intersectionCoords, stepsToIntersection];
  }

  const stepsArr = fs.readFileSync(path.resolve(__dirname, "../data/3.txt"))
    .toString().trim().split(/\r?\n/);
  const [intersections, stepsToIntersection] = getIntersectionsAndCombinedSteps([getSteps(stepsArr[0]), getSteps(stepsArr[1])]);
  const distances = intersections.map(it => Math.abs(it.x) + Math.abs(it.y)).sort((a, b) => a - b);
  const closest = distances[0] === 0 ? distances[1] : distances[0];
  //Part two
  const steps = stepsToIntersection.sort((a, b) => a - b)
  return [closest, steps[0] === 0 ? steps[1] : steps[0]]
}
