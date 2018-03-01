// NOTE to run it
// node solution.js  < input.txt

const _ = require('lodash');

process.stdin.resume();
process.stdin.setEncoding('ascii');

const debug = () => process.env.DEBUG;

var input_stdin = "";
var input_stdin_array = "";
var input_currentline = 0;

process.stdin.on('data', function (data) {
    input_stdin += data;
});

process.stdin.on('end', function () {
    input_stdin_array = input_stdin.split("\n");
    main();
});

function readLine() {
    return input_stdin_array[input_currentline++];
}

// N subsequent lines of the input file describe the individual rides, from ride 0 to ride N − 1 . Each line
// contains the following integer numbers separated by single spaces:
// ● a – the row of the start intersection (0 ≤ a < R)
// ● b – the column of the start intersection (0 ≤ b < C)
// ● x – the row of the finish intersection (0 ≤ x < R)
// ● y – the column of the finish intersection (0 ≤ y < C)
// ● s – the earliest start(0 ≤ s < T)
// ● f – the latest finish (0 ≤ f ≤ T) , (f ≥ s + |x − a| + |y − b|)
// ○ note that f can be equal to T – this makes the latest finish equal to the end of the simulation
class Ride {
  constructor(id, startX, startY, endX, endY, startTime, endTime) {
    this.id = id;
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.duration = getDistance([ this.startX, this.startY ], [this.endX, this.endY])

    this.startTime = startTime;
    this.endTime = endTime;

    this.maxStartTime = endTime - this.duration;

    this.assigned = false;
  }

  distanceFromVehicule(vehicle) {
    return getDistance([ vehicle.x, vehicle.y ], [this.startX, this.startY]);
  }

  distance() {
    return getDistance([this.endX, this.endY], [this.startX, this.startY])
  }
}

class Vehicle {
  constructor(id) {
    this.id = id;

    this.x = 0;
    this.y = 0;
    this.finishAt = 0;
    this.rides = [];

    this.nextX = null;
    this.nextY = null;
    this.stepsRemaining = null;
  }

  assign(ride, currentStep) {
    if (debug()) console.log('@assign to', this.id, ' : ', ride.id, '(', this.isFreeAtStep(currentStep)  ,')');
    ride.assigned = true;
    this.nextX = ride.startX;
    this.nextY = ride.startY;

    this.finishAt = Math.max(
      ride.startTime,
      currentStep + this.distanceFromRide(ride)
    ) + ride.duration;
    this.rides.push(ride);
  }

  distanceFromRide(ride) {
    return getDistance([ this.x, this.y ], [ride.startX, ride.startY]);
  }

  canDoRide(ride, currentStep) {
    return (currentStep + this.distanceFromRide(ride)) < ride.maxStartTime;
  }

  isFreeAtStep(currentStep) {
    return this.finishAt <= currentStep;
  }
}

// qui retourne le nombre de step au passage
function getDistance([x, y], [x2, y2]) {
  return Math.abs(x - x2) + Math.abs(y - y2);
}
function rankDriver(vehicle, ride, stepNumber) {
  // driver pas dispo
  if (!vehicle.isFreeAtStep(stepNumber)) return Infinity;
  // distance vers le point de depart
  const distance = vehicle.distanceFromRide(ride);
  // on peut au maximum commencer à maintenant + distance qui nous sépare du point
  const minStartTime = stepNumber + distance;
  // on va attendre peut-être
  const waitTime = Math.min(0, ride.maxStartTime - minStartTime);

  if (ride.maxStartTime < minStartTime) return Infinity;
  return distance + waitTime;
}

// Courses triées par heure de départ
const sortRidesByStartTime = rides => _.sortBy(rides, ride => ride.startTime)
const sortRidesByDistance = rides => _.sortBy(rides, ride => ride.distance).reverse();
const getFreeVehicles = (vehicles, currentStep) => _.filter(vehicles, v => v.isFreeAtStep(currentStep))

function solution1(rides, vehicles) {
  let sortedRides = sortRidesByStartTime(rides);
  sortedRides = sortedRides.reverse();

  for (let step = 0; sortedRides.length > 0; step++) {
    // trouver les driver libres
    const freeDrivers = getFreeVehicles(vehicles, step);
    const numberOfFreeDriver = freeDrivers.length;

    for(let i = 0; i < numberOfFreeDriver; i++) {
      const nextRide = sortedRides.pop();
      const driversSortedByDistances = _.sortBy(freeDrivers, rider => rankDriver(rider, nextRide, step));

      driversSortedByDistances[0].assign(nextRide, step);
      if (sortedRides.length === 0) break;
    }
  }
}

function solution2(rides, vehicles) {
  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];

    while(true) {
      // on chercher la course la plus proche..
      const rideNotTakenAndInTheFuture = _.filter(rides, ride => {
        return !ride.assigned && vehicle.canDoRide(ride, vehicle.finishAt);
      })

      const rideNotTakenAndInTheFutureSorted = _.sortBy(rideNotTakenAndInTheFuture, ride => {
        return vehicle.distanceFromRide(ride);
      });

      if (_.isEmpty(rideNotTakenAndInTheFutureSorted)) {
        break;
      }

      // ...on l'assigne
      vehicle.assign(rideNotTakenAndInTheFutureSorted[0], vehicle.finishAt);
    }
  }
}


function main() {
  const [ rows, columns, numberOfVehicules, numberOfRides, bonus, numberOfSteps ] = readLine().split(' ');

  const params = { rows, columns, numberOfVehicules, numberOfRides, bonus, numberOfSteps }

  const rides = _.range(numberOfRides).map((id) => new Ride(id, ...readLine().split(' ')));
  const vehicles = _.range(numberOfVehicules).map((id) => new Vehicle(id));

  solution2(rides, vehicles);

  vehicles.forEach((v, i) => {
    // console.log()
    const result = `${v.rides.length} ${v.rides.map(r => r.id).join(' ')}`;
    console.log(result);
  });
}
