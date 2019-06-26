window.onload = function() {

  // make an array of all the data locations
  var files = ["./Data/bodemfauna.json", "./Data/vissentrend.json", "./Data/vogels.json", "./Data/zoogdieren.json", "./Data/vistechnieken.json"];

  // make an empty array for the promises
  var promises = [];

  // loop over the file location names and push them as json files  into promises
  files.forEach(function(url) {
    promises.push(d3.json(url))
  });

  // promise function
  Promise.all(promises).then(function(values) {

    // function located in stackedLine.js
    makeStackLine(values[0], values[1], values[2], values[3], values[4])

    // function located in circlePacking.js
    makeCirclePacking(values[0], values[1], values[2], values[3])

    // function located in lineChart.js
    makenormLine(values[0], values[1], values[2], values[3])

    // function located in slider.js
    makeSlider(values[0], values[1], values[2], values[3],values[4])
  });
}
