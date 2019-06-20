var files = ["Data/bodemFauna.json", "Data/vissentrend.json", "Data/vogels.json","Data/zoogdieren.json","Data/vistechnieken.json"];

var promises = [];

files.forEach(function(url) {
    promises.push(d3.json(url))
});

Promise.all(promises).then(function(values) {
    console.log(values)
    makeStackLine(values[0],values[1],values[2],values[3],values[4])
    makeCirclePacking(values[0],values[1],values[2],values[3],"Make",2000)
    makenormLine(values[0],values[1],values[2],values[3])
});
