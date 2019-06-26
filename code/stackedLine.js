function makeStackLine(bodem, vissentrend, vogel, zoogdier, data) {

  // make the margins for the chart
  var margin = {
    top: 25,
    right: 30,
    bottom: 75,
    left: 50
  };

  //  make a deepcopy of the data to keep the original the same
  let deepClone = JSON.parse(JSON.stringify(data));

  // get the width and height from the div on the html page
  var width = document.getElementById("stackline").clientWidth;
  var height = document.getElementById("stackline").clientHeight;

  // appeng a svg and a g element to the div
  var stackedLine = d3.select("#stackline")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "stackline")
    .append("g")
    .attr("transform", "translate(0,0)");


  // get the first object of the array
  var object = deepClone[0];

  // make an empty array to put the keys in
  var keys = [];

  // iterate over the object and  push the names in the array
  for (var property in object) {
    if (property != 'Jaar') {
      keys.push(property);
    }
  }

  // color palette
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSet2);

  //stack the data
  var stackedData = d3.stack()
    .keys(keys)
    (deepClone);


  // Add X scaling
  var xScale = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {
      return d.Jaar;
    }))
    .range([margin.left, width - margin.right]);

  // Add Y scaling
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(stackedData, function(d) {
      return d3.max(d, function(d) {
        return Math.ceil(d[0] / 10) * 10;
      });
    })])
    .range([height - margin.bottom, margin.top]);

  // make variable for the x-axis
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.format("d"))
    .ticks(20);

  // make variable for the y-axis
  var yAxis = d3.axisLeft()
  .scale(yScale);

  // append the y-axis
  stackedLine.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate( " + margin.left + ", " + 0 + ")")
    .call(yAxis);

  // append the x-axis
  stackedLine.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 0 + ", " + (height - margin.bottom) + ")")
    .call(xAxis);

  // rotate the x-axis labels 30 dergrees
  stackedLine.select(".x.axis")
    .selectAll("text")
    .attr("y", 10)
    .attr("x", 5)
    .attr("dy", ".35em")
    .attr("transform", "rotate(30)")
    .style("text-anchor", "start");

  // Add X axis label:
  stackedLine.append("text")
    .attr("text-anchor", "end")
    .attr("x", width - 100)
    .attr("y", height - 35)
    .text("Tijd (jaar)");

  // Add Y axis label:
  stackedLine.append("text")
    .attr("text-anchor", "end")
    .attr("x", -50)
    .attr("y", 20)
    .text("Miljoen pk-dagen")
    .attr("transform", "rotate(-90)");

  // Add chart label:
  stackedLine.append("text")
    .attr("text-anchor", "end")
    .attr("x", 300)
    .attr("y", 20)
    .text("inzet visserijtechnieken per jaar");

  var xTicks = 25;
  var yTicks = 8;

  // function to make the x-gridlines (hard coded because it only occurs once)
  function make_x_gridlines() {
    return d3.axisBottom(xScale)
      .ticks(xTicks);
  }

  // function to make the y-gridlines (hard coded because it only occurs once)
  function make_y_gridlines() {
    return d3.axisLeft(yScale)
      .ticks(yTicks);
  }

  // append the X gridlines
  stackedLine.append("g")
    .attr("class", "x grid")
    .attr("transform", "translate( " + 0 + ", " + (height - margin.bottom) + ")")
    .call(make_x_gridlines()
      .tickSize(-height + margin.top + margin.bottom)
      .tickFormat("")
    ).style("color", "white");

  // append the Y gridlines
  stackedLine.append("g")
    .attr("class", "y grid")
    .attr("transform", "translate( " + margin.left + ", " + 0 + ")")
    .call(make_y_gridlines()
      .tickSize(margin.right + margin.left - width)
      .tickFormat("")
    );

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = stackedLine.append("defs").append("stackedLine:clipPath")
    .attr("id", "clip")
    .append("stackedLine:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);


  // Create the scatter variable: where both the circles and the brush take place
  var areaChart = stackedLine.append('g')
    .attr("clip-path", "url(#clip)");

  // Area generator
  var area = d3.area()
    .x(function(d) {
      return xScale(d.data.Jaar);
    })
    .y0(function(d) {
      return yScale(d[0]);
    })
    .y1(function(d) {
      return yScale(d[1]);
    })
    .curve(d3.curveCatmullRom.alpha(1)); // apply smoothing to the line

  // append the areas
  var areas = areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", function(d) {
      return "myArea " + d.key;
    })
    .style("fill", function(d) {
      return color(d.key);
    })
    .style("opacity", .7)
    .attr("d", area);

  var idleTimeout;

  function idled() {
    idleTimeout = null;
  }


  // What to do when one group is hovered
  var highlight = function(d) {
    // reduce opacity of all groups
    d3.selectAll(".myArea").style("opacity", .3);
    // expect the one that is hovered
    d3.select("." + d).style("opacity", 1);
  };

  // And when it is not hovered anymore
  var noHighlight = function(d) {
    d3.selectAll(".myArea").style("opacity", .8);
  };


  var size = 15;


  stackedLine.append("rect")
    .attr("class", "legend")
    .attr("x", (width - 105 - margin.right))
    .attr("y", margin.top)
    .attr("width", 120)
    .attr("height", 125)
    .style("fill", "	#F0F8FF")
    .style("opacity", "0.9");

  // boolean oprator for each name (used in click function)
  var toggleSelected = {
    Boomkor: true,
    Flyshoot: true,
    Puls: true,
    Sumwing: true,
    Garnalen: true,
    Diversen: true
  };

  // Add one rectangle in the legend for each name.(checkbox)
  stackedLine.selectAll("myrect")
    .data(keys)
    .enter()
    .append("rect")
    .attr("x", (width * 0.80))
    .attr("y", function(d, i) {
      return 30 + i * (size + 5);
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .attr("class", function(d) {
      return "rect" + d;
    })
    .attr("stroke-width", "3")
    .attr("stroke", function(d) {
      return color(d);
    })
    .style("fill", function(d) {
      return color(d);
    })
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)
    // on click the selected area will be removed or added depending on the state of the bool.
    .on("click", function(d) {
      if (toggleSelected[d] == true) {
        d3.select(this).style("fill", "white");
        updateStackLine(deepClone, keys, d, data, toggleSelected[d], xScale, yScale);
        toggleSelected[d] = false;
      } else {
        d3.select(this).style("fill", function(d) {
          return color(d);
        });
        updateStackLine(deepClone, keys, d, data, toggleSelected[d], xScale, yScale);
        toggleSelected[d] = true;
      }
    });


  // Add text per rectangle in the legend for each name.(checkbox)
  stackedLine.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", (width * 0.8) + size * 1.2)
    .attr("y", function(d, i) {
      return 30 + i * (size + 5) + (size / 2);
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d) {
      return color(d);
    })
    .style("opacity", "1.5")
    .text(function(d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)
    // on click the selected area will be removed or added depending on the state of the bool.
    .on("click", function(d) {
      if (toggleSelected[d] == true) {
        d3.select(".rect" + d + "").style("fill", "white");
        updateStackLine(deepClone, keys, d, data, toggleSelected[d], xScale, yScale);
        toggleSelected[d] = false;
      } else {
        d3.select(".rect" + d).style("fill", function(d) {
          return color(d);
        });
        updateStackLine(deepClone, keys, d, data, toggleSelected[d], xScale, yScale);
        toggleSelected[d] = true;
      }
    });

}

// function for adding or removing areas
function updateStackLine(temp, keys, name, data, mode, xScale, yScale) {

  // make margins again
  var margin = {
    top: 25,
    right: 30,
    bottom: 75,
    left: 50
  };

  // get the width and height again
  var width = document.getElementById("stackline").clientWidth;
  var height = document.getElementById("stackline").clientHeight;

  // check if the checkbox is true or false

  if (mode == true) {
    // if true make the value of the area 0 thus making it invisible
    temp.forEach(function(d) {
      d[name] = 0;
    });
  }

  if (mode == false) {
    // if false make it the old values of the origonal data again thus making it visible
    temp.forEach(function(d, i) {
      d[name] = data[i][name];
    });
  }

  //stack the data
  var stackedData = d3.stack()
    .keys(keys)
    (temp);

  // make the variable vor the div again
  var stackedLine = d3.select("#stackline");

  // append clip path again
  var areaChart = stackedLine.append('g')
    .attr("clip-path", "url(#clip)");

  // Area generator
  var area = d3.area()
    .x(function(d) {
      return xScale(d.data.Jaar);
    })
    .y0(function(d) {
      return yScale(d[0]);
    })
    .y1(function(d) {
      return yScale(d[1]);
    }).curve(d3.curveCatmullRom.alpha(1)); // apply smoothing to the line

  // append the new area
  d3.selectAll(".myArea")
    .data(stackedData)
    .transition()
    .attr("d", area);
}
