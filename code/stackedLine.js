function makeStackLine(bodem, vissentrend, vogel, zoogdier, data) {

  var margin = {
    top: 25,
    right: 30,
    bottom: 75,
    left: 50
  };

  let deepClone = JSON.parse(JSON.stringify(data));

  var width = document.getElementById("stackline").clientWidth;
  var height = document.getElementById("stackline").clientHeight;

  var stackedLine = d3.select("#stackline")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "stackline")
    .append("g")
    .attr("transform", "translate(0,0)");

  var object = deepClone[0]

  var keys = []

  for (var property in object) {
    if (property != 'Jaar') {
      keys.push(property)
    }
  }

  // color palette
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSet2);

  //stack the data?
  var stackedData = d3.stack()
    .keys(keys)
    (deepClone)


  // Add X axis
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {
      return d.Jaar;
    }))
    .range([margin.left, width - margin.right]);

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(stackedData, function(d) {
      return d3.max(d, function(d) {
        return Math.ceil(d[0] / 10) * 10;
      });
    })])
    .range([height - margin.bottom, margin.top]);

  var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(d3.format("d"))
    .ticks(20);

  var yAxis = d3.axisLeft()
    .scale(y);

  stackedLine.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate( " + margin.left + ", " + 0 + ")")
    .call(yAxis);


  stackedLine.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 0 + ", " + (height - margin.bottom) + ")")
    .call(xAxis);

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

  // Add X axis label:
  stackedLine.append("text")
    .attr("text-anchor", "end")
    .attr("x", 300)
    .attr("y", 20)
    .text("inzet visserijtechnieken per jaar");

  // Add Y axis label:
  stackedLine.append("text")
    .attr("text-anchor", "end")
    .attr("x", -50)
    .attr("y", 20)
    .text("Miljoen pk-dagen")
    .attr("transform", "rotate(-90)");


  function make_x_gridlines() {
    return d3.axisBottom(x)
      .ticks(15)
  }

  // gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(y)
      .ticks(8)
  }

  stackedLine.append("g")
    .attr("class", "x grid")
    .attr("transform", "translate( " + 0 + ", " + (height - margin.bottom) + ")")
    .call(make_x_gridlines()
      .tickSize(-height + margin.top + margin.bottom)
      .tickFormat("")
    ).style("color", "white")

  // add the Y gridlines
  stackedLine.append("g")
    .attr("class", "y grid")
    .attr("transform", "translate( " + margin.left + ", " + 0 + ")")
    .call(make_y_gridlines()
      .tickSize(margin.right + margin.left - width)
      .tickFormat("")
    )

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
    .attr("clip-path", "url(#clip)")

  // Area generator
  var area = d3.area()
    .x(function(d) {
      return x(d.data.Jaar);
    })
    .y0(function(d) {
      return y(d[0]);
    })
    .y1(function(d) {
      return y(d[1]);
    }).curve(d3.curveCatmullRom.alpha(1)) // apply smoothing to the line

  // Show the areas
  var areas = areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", function(d) {
      return "myArea " + d.key
    })
    .style("fill", function(d) {
      return color(d.key);
    })
    .style("opacity", .7)
    .attr("d", area);

  var idleTimeout

  function idled() {
    idleTimeout = null;
  }


  // What to do when one group is hovered
  var highlight = function(d) {
    // reduce opacity of all groups
    d3.selectAll(".myArea").style("opacity", .3)
    // expect the one that is hovered
    d3.select("." + d).style("opacity", 1)
  }

  // And when it is not hovered anymore
  var noHighlight = function(d) {
    d3.selectAll(".myArea").style("opacity", .8)
  }

  // Add one dot in the legend for each name.
  var size = 15
  stackedLine.append("rect")
    .attr("class", "legend")
    .attr("x", (width - 105 - margin.right))
    .attr("y", margin.top)
    .attr("width", 120)
    .attr("height", 125)
    .style("fill", "	#F0F8FF")
    .style("opacity", "0.9")

  var toggleSelected = {
    Boomkor: true,
    Flyshoot: true,
    Puls: true,
    Sumwing: true,
    Garnalen: true,
    Diversen: true
  }

  stackedLine.selectAll("myrect")
    .data(keys)
    .enter()
    .append("rect")
    .attr("x", (width * 0.80))
    .attr("y", function(d, i) {
      return 30 + i * (size + 5)
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .attr("class",function(d) {
      return "rect" + d
    } )
    .attr("stroke-width", "3")
    .attr("stroke", function(d) {
      return color(d)
    })
    .style("fill", function(d) {
      return color(d)
    })
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)
    .on("click", function(d) {
      if (toggleSelected[d] == true) {
        d3.select(this).style("fill", "white");
        updateStackLine(deepClone, keys, d, data, toggleSelected[d], x, y)
        toggleSelected[d] = false;
      } else {
        d3.select(this).style("fill", function(d) {
          return color(d)
        });
        updateStackLine(deepClone, keys, d, data, toggleSelected[d], x, y)
        toggleSelected[d] = true;
      }
    });


  // Add one dot in the legend for each name.
  stackedLine.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", (width * 0.8) + size * 1.2)
    .attr("y", function(d, i) {
      return 30 + i * (size + 5) + (size / 2)
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d) {
      return color(d)
    })
    .style("opacity", "1.5")
    .text(function(d) {
      return d
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)
    .on("click", function(d) {
      console.log("rect "+ d +"")
      if (toggleSelected[d] == true) {
        d3.select(".rect" + d + "").style("fill", "white");
        updateStackLine(deepClone, keys, d, data, toggleSelected[d], x, y)
        toggleSelected[d] = false;
      } else {
        d3.select(".rect" + d).style("fill", function(d) {
          return color(d)
        });
        updateStackLine(deepClone, keys, d, data, toggleSelected[d], x, y)
        toggleSelected[d] = true;
      }
    });

};

function updateStackLine(temp, keys, name, data, mode, x, y) {

  var margin = {
    top: 25,
    right: 30,
    bottom: 75,
    left: 50
  };

  var width = document.getElementById("stackline").clientWidth;
  var height = document.getElementById("stackline").clientHeight;

  if (mode == true) {
    temp.forEach(function(d) {
      d[name] = 0;
    })
  }

  if (mode == false) {
    temp.forEach(function(d, i) {
      d[name] = data[i][name];
    })
  }

  //stack the data?
  var stackedData = d3.stack()
    .keys(keys)
    (temp)


  var stackedLine = d3.select("#stackline")

  var areaChart = stackedLine.append('g')
    .attr("clip-path", "url(#clip)")

  // Area generator
  var area = d3.area()
    .x(function(d) {
      return x(d.data.Jaar);
    })
    .y0(function(d) {
      return y(d[0]);
    })
    .y1(function(d) {
      return y(d[1]);
    }).curve(d3.curveCatmullRom.alpha(1)) // apply smoothing to the line


  d3.selectAll(".myArea")
    .data(stackedData)
    .transition()
    .attr("d", area);


  d3.selectAll(".myArea").data(stackedData).exit().remove();
}
