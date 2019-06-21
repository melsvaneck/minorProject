window.onload = function() {
var files = ["minorProject/code/Data/bodemFauna.json", "minorProject/code/Data/vissentrend.json", "minorProject/code/Data/vogels.json","minorProject/code/Data/zoogdieren.json","minorProject/code/Data/vistechnieken.json"];

var promises = [];

files.forEach(function(url) {
    promises.push(d3.json(url))
});

Promise.all(promises).then(function(values) {
  var years = []

  values[4].forEach(function(d){
    years.push(d.Jaar);
  })

    makeStackLine(values[0],values[1],values[2],values[3],values[4])
    makeCirclePacking(values[0],values[1],values[2],values[3])
    makenormLine(values[0],values[1],values[2],values[3])
    makeSlider(years ,values[0],values[1],values[2],values[3])
});
}
