function makenormLine(bodem, vissentrend, vogel, zoogdier)
{
  var margin = {
    top: 20,
    right: 30,
    bottom: 75,
    left: 60
  };

  var width = document.getElementById("normline").clientWidth;
  var height = document.getElementById("normline").clientHeight;

  var normLine = d3.select("#normline")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(0,0)");

  var dataset = makeLineData(["Noordse stormvogel", "vogels"])

  // 5. X scale will use the index of our data
  var xScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) {
      return d.year;
    }), d3.max(dataset, function(d) {
      return d.year;
    })]) // input
    .range([margin.left, width - margin.right]); // output

    // 6. Y scale will use the randomly generate number
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, function(d) {
        return Math.ceil(d.y / 100) * 100;
      })]).range([height - margin.bottom, margin.top]); // output

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
      .attr("transform", "translate(0," + (height - margin.bottom) + ")")
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
      .attr("transform", "translate(" + margin.left + ", 0 )"); // Create an axis component with d3.axisLeft

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
      .attr("transform", "translate(0," + (height - margin.bottom) + ")")
      .call(make_x_gridlines()
        .tickSize(-height + margin.top + margin.bottom)
        .tickFormat("")
      )

    // add the Y gridlines
    normLine.append("g")
      .attr("class", "y grid")
      .attr("transform", "translate(" + margin.left + "," + 0 + ")")
      .call(make_y_gridlines()
        .tickSize(-width + margin.right + margin.left)
        .tickFormat("")
      )

    // 9. Append the path, bind the data, and call the line generator
    normLine.append("path")
      .datum(dataset) // 10. Binds data to the line
      .attr("class", "lijn") // Assign a class for styling
      .attr("d", line); // 11. Calls the line generator

    // Add X axis label:
    normLine.append("text")
      .attr("text-anchor", "end")
      .attr("x", width - 100)
      .attr("y", height - 35)
      .text("Tijd (jaar)");

    // Add Y axis label:
    normLine.append("text")
      .attr("text-anchor", "end")
      .attr("x", -50)
      .attr("y", 20)
      .text("Trend (Waarnemingen)")
      .attr("transform", "rotate(-90)");


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

    bisectDate = d3.bisector(function(d) {
      return d.year;
    }).right;

    var test = normLine.append("g")
      .attr("class", "test")
      .style("display", "none");

    test.append("line")
      .attr("class", "x-hover-line hover-line")
      .attr("y1", 0)
      .attr("y2", height);

    test.append("line")
      .attr("class", "y-hover-line hover-line")
      .attr("x1", width)
      .attr("x2", width);

    test.append("circle")
      .attr("r", 7.5);

    test.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");

    normLine.append("rect")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() {
        test.style("display", null);
      })
      .on("mouseout", function() {
        test.style("display", "none");
      })
      .on("mousemove", mousemove);

    function mousemove() {
      var x0 = xScale.invert(d3.mouse(this)[0]),
        i = bisectDate(dataset, x0, 1),
        d0 = dataset[i - 1],
        d1 = dataset[i],
        d = x0 - d0.year > d1.year - x0 ? d1 : d0;
      test.attr("transform", "translate(" + xScale(d.year) + "," + yScale(d.y) + ")");
      test.select("text").text(function() {
        return d.y;
      });
      test.select(".x-hover-line").attr("y2", height - yScale(d.y));
      test.select(".y-hover-line").attr("x2", width + width);
    }


    function makeLineData(data) {
      console.log(data);
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
}


    function updateLine(data) {

      var dataset = makeLineData(data)

      var margin = {
        top: 20,
        right: 30,
        bottom: 75,
        left: 50
      };

      yScale.domain([0, d3.max(dataset, function(d) {
        return Math.ceil(d.y / 100) * 100;
      })])

      xScale.domain([d3.min(dataset, function(d) {
        return d.year;
      }), d3.max(dataset, function(d) {
        return d.year;
      })]) // input

      min = d3.min(dataset, function(d) {
        return parseInt(d.year, 10);;
      })

      // 7. d3's line generator
      line.x(function(d, i) {
          return xScale(i + min);
        }) // set the x values for the line generator
        .y(function(d) {
          return yScale(d.y);
        }) // set the y values for the line generator
        .curve(d3.curveMonotoneX) // apply smoothing to the line


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
          .tickSize(-width + margin.right + margin.left)
          .tickFormat("")
        )

      // add the Y gridlines
      normLine.selectAll(".x.grid")
        .transition()
        .duration(500)
        .call(make_x_gridlines()
          .tickSize(-height + margin.top + margin.bottom)
          .tickFormat("")
        )

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
    }
