function makenormLine(bodem, vissentrend, vogel, zoogdier) {

  // make the margins
  var margin = {
    top: 20,
    right: 30,
    bottom: 70,
    left: 60
  };

  // get the height and the width of the div
  var width = document.getElementById("normline").clientWidth - margin.top - margin.bottom;
  var height = document.getElementById("normline").clientHeight - margin.top - margin.bottom;

  // append the svg to the div
  var svg = d3.select("#normline")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // append a g element tot the svg
  normLine = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // make variable for default data
  var data = ["Noordse stormvogel", "vogels"];

  // make data ready for the line chart according to the chosen species
  var dataset = makeLineData(data, bodem, vissentrend, vogel, zoogdier);

  // make x-scale
  var xScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) {
      return d.year;
    }), d3.max(dataset, function(d) {
      return d.year;
    })]) // input
    .range([0, width]); // output

  // make y-scale
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) {
      return Math.ceil(d.y / 100) * 100;
    })]).range([height, 0]); // output

  // Call the x axis
  normLine.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d"))
      .ticks(20)).selectAll("text")
    .attr("y", 10)
    .attr("x", 5)
    .attr("dy", ".35em")
    .attr("transform", "rotate(30)")
    .style("text-anchor", "start"); // Create an axis component with d3.axisBottom


  // Call the y axis
  normLine.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale))
    .attr("transform", "translate(0, 0 )"); // Create an axis component with d3.axisLeft

  // get the smallest number of a year
  min = d3.min(dataset, function(d) {
    return d.year;
  });

  // cast to an integer
  var min = parseInt(min, 10);

  // generate line
  var line = d3.line()
    .x(function(d, i) {
      return xScale(i + min);
    }) // set the x values for the line generator
    .y(function(d) {
      return yScale(d.y);
    }) // set the y values for the line generator
    .curve(d3.curveMonotoneX); // apply smoothing to the line

  // gridlines in x axis function
  function make_x_gridlines() {
    return d3.axisBottom(xScale)
      .ticks((d3.max(dataset, function(d) {
        return d.year;
      })) - (d3.min(dataset, function(d) {
        return d.year;
      })));
  }

  // gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(yScale);
  }

  // append the x gridlines
  normLine.append("g")
    .attr("class", "x grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
      .tickSize(-height)
      .tickFormat(""));

  // append the Y gridlines
  normLine.append("g")
    .attr("class", "y grid")
    .attr("transform", "translate(" + 0 + "," + 0 + ")")
    .call(make_y_gridlines()
      .tickSize(-width)
      .tickFormat(""));

  // Append the path with the data made from the line generator
  normLine.append("path")
    .datum(dataset)
    .attr("class", "lijn")
    .attr("d", line);


  // Add X axis label
  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 60)
    .text("Tijd (jaar)");


  // Add Y axis label
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", -50)
    .attr("y", 20)
    .text("Waarnemingen (trend)")
    .attr("transform", "rotate(-90)");

  // add chart name
  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 200)
    .attr("y", 15)
    .text("trend per diersoort");

  // add the name of the chosen species
  svg
    .append("text")
    .attr("class", "soort")
    .attr("text-anchor", "end")
    .attr("x", width + 50)
    .attr("y", 15)
    .text(data[0]);

  // Append a circle for each datapoint
  normLine.selectAll(".dot")
    .data(dataset)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", function(d, i) {
      return xScale(i + min);
    })
    .attr("cy", function(d) {
      return yScale(d.y);
    })
    .attr("r", 5);



  var values = [];

  // parse the data and push it to the array
  dataset.forEach(function(d) {
    values.push({
      date: d.year,
      temperature: d.y
    });
  });

  // reform the data to an array of objects for the mousetracker function
  var trend = [{
    name: "lineone",
    values: values
  }];

  // append a group for the mouse tracker
  var mouseG = normLine.append("g")
    .attr("class", "mouse-over-effects");

  // this is the black vertical line to follow mouse
  mouseG.append("path")
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  // get the line that has been made
  var lines = document.getElementsByClassName('lijn');


  var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(trend)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

  mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", "black")
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  mousePerLine.append("text")
    .attr("transform", "translate(10,3)");

  mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr("class", "rectangle")
    .attr('width', (width)) // can't catch mouse events on a g element
    .attr('height', (height))
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() { // on mouse out hide line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "0");
    })
    .on('mouseover', function() { // on mouse in show line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "1");
    })
    .on('mousemove', function() { // mouse moving over canvas
      var mouse = d3.mouse(this);
      d3.select(".mouse-line")
        .attr("d", function() {
          var d = "M" + mouse[0] + "," + height;
          d += " " + mouse[0] + "," + 0;
          return d;
        });

      d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {
          var xDate = xScale.invert(mouse[0]),
            bisect = d3.bisector(function(d) {
              return d.date;
            }).right;
          idx = bisect(d.values, xDate);

          var beginning = 0,
            end = lines[i].getTotalLength(),
            target = null;

          while (true) {
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
              break;
            }
            if (pos.x > mouse[0]) end = target;
            else if (pos.x < mouse[0]) beginning = target;
            else break; //position found
          }
          d3.select(this).select('text')
            .text(yScale.invert(pos.y).toFixed(2));

          return "translate(" + mouse[0] + "," + pos.y + ")";
        });
    });
}

// update the line chart according to the selected circle from the circle packing chart
function updateLine(data, bodem, vissentrend, vogel, zoogdier) {

  // make the new dataset according too the chosen animal
  var dataset = makeLineData(data, bodem, vissentrend, vogel, zoogdier);

  // make margins again
  var margin = {
    top: 20,
    right: 30,
    bottom: 70,
    left: 60
  };


  // get the width and height according to the div sixe again
  var width = document.getElementById("normline").clientWidth - margin.top - margin.bottom;
  var height = document.getElementById("normline").clientHeight - margin.top - margin.bottom;

  // select the div
  var normLine = d3.select("#normline");

  //make the new x scale
  var xScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) {
      return d.year;
    }), d3.max(dataset, function(d) {
      return d.year;
    })]) // input
    .range([0, width]);

  // make the new y scale
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) {
      return Math.ceil(d.y / 100) * 100;
    })]).range([height, 0]);

  // get smallest year number again
  min = d3.min(dataset, function(d) {
    return d.year;
  });

  var min = parseInt(min, 10);

  //make new line according to new data
  var line = d3.line()
    .x(function(d, i) {
      return xScale(i + min);
    }) // set the x values for the line generator
    .y(function(d) {
      return yScale(d.y);
    }) // set the y values for the line generator
    .curve(d3.curveMonotoneX); // apply smoothing to the line

   // gridlines in x axis function
  function make_x_gridlines() {
    return d3.axisBottom(xScale)
      .ticks((d3.max(dataset, function(d) {
        return d.year;
      })) - (d3.min(dataset, function(d) {
        return d.year;
      })));
  }

  // gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(yScale);
  }

  //Call the y axis
  normLine.selectAll(".y.axis")
    .transition()
    .duration(1000)
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  //Call the x axis
  normLine.select(".x.axis")
    .transition()
    .duration(1000)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d"))
      .ticks(20));

  // turn the x axis labels 30 degrees
  normLine.select(".x.axis")
    .selectAll("text")
    .attr("y", 10)
    .attr("x", 5)
    .attr("dy", ".35em")
    .attr("transform", "rotate(30)")
    .style("text-anchor", "start");


  // add the Y gridlines
  normLine.selectAll(".y.grid")
    .transition()
    .duration(500)
    .call(make_y_gridlines()
      .tickSize(-width)
      .tickFormat("")
    );

  // add the X gridlines
  normLine.selectAll(".x.grid")
    .transition()
    .duration(500)
    .call(make_x_gridlines()
      .tickSize(-height)
      .tickFormat("")
    );

  // change the animal name of the chart
  d3.select(".soort")
    .attr("text-anchor", "end")
    .attr("x", width + 50)
    .attr("y", 15)
    .text(data[0]);

  //change the path with the new line
  normLine.selectAll(".lijn")
    .datum(dataset)
    .transition()
    .duration(1000) //Binds data to the line
    .attr("d", line); //Calls the line generator

  // append new dots if there ara new ones
  normLine.selectAll(".dot")
    .data(dataset)
    .enter().append("circle")
    .transition()
    .duration(1000) // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) {
      return xScale(i + min);
    })
    .attr("cy", function(d) {
      return yScale(d.y);
    })
    .attr("r", 5);

  // update the dots
  normLine.selectAll(".dot")
    .data(dataset)
    .transition()
    .duration(1000) // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) {
      return xScale(i + min);
    })
    .attr("cy", function(d) {
      return yScale(d.y);
    })
    .attr("r", 5);

  // remove extra dots if any
  normLine.selectAll(".dot")
    .data(dataset).exit().remove();

  // update the mouse tracking functioni according to the new data
  values = [];

  dataset.forEach(function(d) {
    values.push({
      date: d.year,
      temperature: d.y
    });
  });

  var trend = [{
    name: "lineone",
    values: values
  }];

  var mouseG = normLine.selectAll(".mouse-over-effects")
    .attr("class", "mouse-over-effects");

  var lines = document.getElementsByClassName('lijn');

  mouseG.select(".rectangle") // append a rect to catch mouse movements on canvas
    .attr('width', (width)) // can't catch mouse events on a g element
    .attr('height', (height))
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() { // on mouse out hide line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "0");
    })
    .on('mouseover', function() { // on mouse in show line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "1");
    })
    .on('mousemove', function() { // mouse moving over canvas
      var mouse = d3.mouse(this);
      d3.select(".mouse-line")
        .attr("d", function() {
          var d = "M" + mouse[0] + "," + height;
          d += " " + mouse[0] + "," + 0;
          return d;
        });

      d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {
          var xDate = xScale.invert(mouse[0]),
            bisect = d3.bisector(function(d) {
              return d.date;
            }).right;
          idx = bisect(d.values, xDate);

          var beginning = 0,
            end = lines[i].getTotalLength(),
            target = null;

          while (true) {
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
              break;
            }
            if (pos.x > mouse[0]) end = target;
            else if (pos.x < mouse[0]) beginning = target;
            else break; //position found
          }
          d3.select(this).select('text')
            .text(yScale.invert(pos.y).toFixed(2));

          return "translate(" + mouse[0] + "," + pos.y + ")";
        });
    });
}

// function to make the data usable for the line graph
function makeLineData(data, bodem, vissentrend, vogel, zoogdier) {

  var lineData = [];

  // choose the right data according to the species with a switch statement
  switch (data[1]) {
    case "bodemfauna":
      Object.keys(bodem).forEach(year => {
        lineData.push({
          year: year,
          y: bodem[year][data[0]]
        });
      });
      break;
    case "vogels":
      Object.keys(vogel).forEach(year => {
        lineData.push({
          year: year,
          y: vogel[year][data[0]]
        });
      });
      break;
    case "zoogdieren":
      Object.keys(zoogdier).forEach(year => {
        lineData.push({
          year: year,
          y: zoogdier[year][data[0]]
        });
      });
      break;
    case "vissen":
      Object.keys(vissentrend).forEach(year => {
        lineData.push({
          year: year,
          y: vissentrend[year][data[0]]
        });
      });
      break;
    default:
      null;
  }

  return lineData;
}
