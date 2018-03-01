// NOTE to run it
// node solution.js  < input.txt

const _ = require('lodash');

process.stdin.resume();
process.stdin.setEncoding('ascii');

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
function Ride(startX, startY, endX, endY, startTime, endTime) {
  this.startX = startX;
  this.startY = startY;
  this.endX = endY;
  this.startTime = startTime;
  this.endTime = endTime;
}

function main() {
  var arr = [];

  // File format
  // The first line of the input file contains the following integer numbers separated by single spaces:
  // ● R – number of rows of the grid (1 ≤ R ≤ 10000)
  // ● C – number of columns of the grid (1 ≤ C ≤ 10000)
  // ● F – number of vehicles in the fleet (1 ≤ F ≤ 1000)
  // ● N – number of rides (1 ≤ N ≤ 10000)
  // ● B – per-ride bonus for starting the ride on time (1 ≤ B ≤ 10000)
  // ● T – number of steps in the simulation (1 ≤ T ≤ 10 )
  const [ rows, columns, numberOfVehicules, numberOfRides, bonus, numberOfSteps ] = readLine().split(' ');

  const params = { rows, columns, numberOfVehicules, numberOfRides, bonus, numberOfSteps }

  // console.log('R', R);

  const rides = [];
  for (i = 0; i < numberOfRides; i++) {
    rides[i] = new Ride(...readLine().split(' '));
  }

  // for(arr_i = 0; arr_i < 6; arr_i++) {
  //   arr[arr_i] = arr[arr_i].map(Number);
  // }

  console.log('rides', rides)
}

// getDistance([x, y], [x, y])
function getDistance([x, y], [x2, y2]) {
  return Math.abs(x - x2) + Math.abs(y - y2);
}



// Course triée par heure de départ
// const ridesSortedByStartTime = _.sort(rides,, )
