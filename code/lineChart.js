function makenormLine(bodem, vissentrend, vogel, zoogdier) {
  var margin = {
    top: 20,
    right: 30,
    bottom: 70,
    left: 60
  };

  var width = document.getElementById("normline").clientWidth - margin.top - margin.bottom;
  var height = document.getElementById("normline").clientHeight - margin.top - margin.bottom;

  var svg = d3.select("#normline")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  normLine = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var data = ["Noordse stormvogel", "vogels"];

  var dataset = makeLineData(data, bodem, vissentrend, vogel, zoogdier)

  // 5. X scale will use the index of our data
  var xScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) {
      return d.year;
    }), d3.max(dataset, function(d) {
      return d.year;
    })]) // input
    .range([0, width]); // output

  // 6. Y scale will use the randomly generate number
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) {
      return Math.ceil(d.y / 100) * 100;
    })]).range([height, 0]); // output

  min = d3.min(dataset, function(d) {
    return d.year;
  })

  var min = parseInt(min, 10);

  // 7. d3's line generator
  var line = d3.line()
    .x(function(d, i) {
      return xScale(i + min);
    }) // set the x values for the line generator
    .y(function(d) {
      return yScale(d.y);
    }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

  // 3. Call the x axis in a group tag
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


  // 4. Call the y axis in a group tag
  normLine.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale))
    .attr("transform", "translate(0, 0 )"); // Create an axis component with d3.axisLeft

  function make_x_gridlines() {
    return d3.axisBottom(xScale)
      .ticks((d3.max(dataset, function(d) {
        return d.year;
      })) - (d3.min(dataset, function(d) {
        return d.year;
      })))
  }

  // gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(yScale)
  }

  normLine.append("g")
    .attr("class", "x grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
      .tickSize(-height)
      .tickFormat("")
    )

  // add the Y gridlines
  normLine.append("g")
    .attr("class", "y grid")
    .attr("transform", "translate(" + 0 + "," + 0 + ")")
    .call(make_y_gridlines()
      .tickSize(-width)
      .tickFormat("")
    )

  // 9. Append the path, bind the data, and call the line generator
  normLine.append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "lijn") // Assign a class for styling
    .attr("d", line); // 11. Calls the line generator


  // Add X axis label:
  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 60)
    .text("Tijd (jaar)");

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 200)
    .attr("y", 15)
    .text("trend per diersoort");

  svg
    .append("text")
    .attr("class", "soort")
    .attr("text-anchor", "end")
    .attr("x", width + 50)
    .attr("y", 15)
    .text(data[0]);

  // 12. Appends a circle for each datapoint
  normLine.selectAll(".dot")
    .data(dataset)
    .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) {
      return xScale(i + min)
    })
    .attr("cy", function(d) {
      return yScale(d.y)
    })
    .attr("r", 5)
    .on("mouseover", function(a, b, c) {
      console.log(a)
    })
    .on("mouseout", function() {})

  values = []

  dataset.forEach(function(d) {
    values.push({
      date: d.year,
      temperature: d.y
    })
  });

  var cities = [{
    name: "lineone",
    values: values
  }]


  var mouseG = normLine.append("g")
    .attr("class", "mouse-over-effects")


  mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  var lines = document.getElementsByClassName('lijn');

  var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(cities)
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

function updateLine(data, bodem, vissentrend, vogel, zoogdier) {

  var dataset = makeLineData(data, bodem, vissentrend, vogel, zoogdier)

  var margin = {
    top: 20,
    right: 30,
    bottom: 70,
    left: 60
  };

  var width = document.getElementById("normline").clientWidth - margin.top - margin.bottom;
  var height = document.getElementById("normline").clientHeight - margin.top - margin.bottom;


  var normLine = d3.select("#normline")

  // 5. X scale will use the index of our data
  var xScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) {
      return d.year;
    }), d3.max(dataset, function(d) {
      return d.year;
    })]) // input
    .range([0, width]); // output

  // 6. Y scale will use the randomly generate number
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) {
      return Math.ceil(d.y / 100) * 100;
    })]).range([height, 0]); // output

  min = d3.min(dataset, function(d) {
    return d.year;
  })

  var min = parseInt(min, 10);

  // 7. d3's line generator
  var line = d3.line()
    .x(function(d, i) {
      return xScale(i + min);
    }) // set the x values for the line generator
    .y(function(d) {
      return yScale(d.y);
    }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

  function make_x_gridlines() {
    return d3.axisBottom(xScale)
      .ticks((d3.max(dataset, function(d) {
        return d.year;
      })) - (d3.min(dataset, function(d) {
        return d.year;
      })))
  }



  // gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(yScale)
  }

  // 4. Call the y axis in a group tag
  normLine.selectAll(".y.axis")
    .transition()
    .duration(1000)
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  // 4. Call the y axis in a group tag
  normLine.select(".x.axis")
    .transition()
    .duration(1000)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d"))
      .ticks(20))

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
    )

  // add the gridlines
  normLine.selectAll(".x.grid")
    .transition()
    .duration(500)
    .call(make_x_gridlines()
      .tickSize(-height)
      .tickFormat("")
    )

  d3.select(".soort")
    .attr("text-anchor", "end")
    .attr("x", width + 50)
    .attr("y", 15)
    .text(data[0]);

  // 9. Append the path, bind the data, and call the line generator
  normLine.selectAll(".lijn")
    .datum(dataset)
    .transition()
    .duration(1000) // 10. Binds data to the line
    .attr("d", line); // 11. Calls the line generator

  normLine.selectAll(".dot")
    .data(dataset)
    .enter().append("circle")
    .transition()
    .duration(1000) // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) {
      return xScale(i + min)
    })
    .attr("cy", function(d) {
      return yScale(d.y)
    })
    .attr("r", 5)

  normLine.selectAll(".dot")
    .data(dataset)
    .transition()
    .duration(1000) // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) {
      return xScale(i + min)
    })
    .attr("cy", function(d) {
      return yScale(d.y)
    })
    .attr("r", 5)

  normLine.selectAll(".dot")
    .data(dataset).exit().remove();

  values = []

  dataset.forEach(function(d) {
    values.push({
      date: d.year,
      temperature: d.y
    })
  });

  var cities = [{
    name: "lineone",
    values: values
  }]

  var mouseG = normLine.selectAll(".mouse-over-effects")
    .attr("class", "mouse-over-effects")

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


function makeLineData(data, bodem, vissentrend, vogel, zoogdier) {

  lineData = []

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
      null
  }

  return lineData;
}
