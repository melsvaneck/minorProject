queue()
  .defer(d3v3.json, "Data/bodemFauna.json")
  .defer(d3v3.json, "Data/vissentrend.json")
  .defer(d3v3.json, "Data/vogels.json")
  .defer(d3v3.json, "Data/zoogdieren.json")
  .defer(d3v3.json, "Data/vistechnieken.json")
  .defer(d3v3.json, "Data/grotevis.json")
  .defer(d3v3.json, "Data/visbestand.json")
  .defer(d3v3.json, "Data/visvangst.json")
  .await(ready);

function ready(error, bodem, vissentrend, vogel, zoogdier, data, grotevis, visbestand, visvangst) {

  var margin = {
    top: 20,
    right: 30,
    bottom: 35,
    left: 30
  };

  var width = 500 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

  // document.getElementById("bar").onclick = makeBar
  document.getElementById("line").onclick = makeLine
  //

  makeLine()
  makeBar()


  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  function makeLine() {

    // append the svg object to the body of the page
    var stackedLine = d3.select("#my_dataviz")
      .append("svg")
      .attr("class", "line")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


    // List of groups = header of the csv files
    var object = data[0]

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
      (data)


    // Add X axis
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) {
        return d.Jaar;
      }))
      .range([0, width]);


    var xAxis = d3.axisBottom()
      .scale(x)
      .tickFormat(d3.format("d"))
      .ticks(20);


    stackedLine.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + (height) + ")")
      .call(xAxis)


    // Add X axis label:
    stackedLine.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 30)
      .text("Time (year)");

    // Add Y axis label:
    stackedLine.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -20)
      .text("# of baby born")
      .attr("text-anchor", "start")

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(stackedData, function(d) {
        return d3.max(d, function(d) {
          return Math.ceil(d[0] / 10) * 10;
        });
      })])
      .range([height, margin.left]);
    stackedLine.append("g")
      .call(d3.axisLeft(y).ticks(5))

    function make_x_gridlines() {
      return d3.axisBottom(x)
        .ticks(20)
    }

    // gridlines in y axis function
    function make_y_gridlines() {
      return d3.axisLeft(y)
        .ticks(5)
    }

    stackedLine.append("g")
      .attr("class", "x grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
        .tickSize(-height + margin.top)
        .tickFormat("")
      )

    stackedLine.selectAll(".x.grid .tick")
      .on("click", function(d) {
        pickYear(d);
      });

    // add the Y gridlines
    stackedLine.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
      )

    stackedLine.selectAll(".x.axis .tick")
      .on("click", function(d) {
        updateCircle(d);
      });


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
    areaChart
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
      .attr("d", area)


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
      d3.selectAll(".myArea").style("opacity", .7)
    }

    // Add one dot in the legend for each name.
    var size = 10

    stackedLine.selectAll("myrect")
      .data(keys)
      .enter()
      .append("rect")
      .attr("x", (width * 0.8))
      .attr("y", function(d, i) {
        return 10 + i * (size + 5)
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size)
      .attr("height", size)
      .style("fill", function(d) {
        return color(d)
      })
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)

    // Add one dot in the legend for each name.
    stackedLine.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
      .attr("x", (width * 0.8) + size * 1.2)
      .attr("y", function(d, i) {
        return 10 + i * (size + 5) + (size / 2)
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d) {
        return color(d)
      })
      .text(function(d) {
        return d
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)
  };



  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



  function makeBar() { // Setup margins,width and height

    vangsten = pickBarYear("2005")

    // Transpose the data into layers
    var dataset = d3.layout.stack()(["bestand", "Aangeland", "Overboord gezet"].map(function(type) {
      return vangsten.map(function(d) {
        return {
          x: d.soort,
          y: +d[type]
        };
      });
    }));

    // make svg for the stacked bar chart
    var stackedBar = d3.select("body")
      .append("svg")
      .attr('class', "bar")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Create yScale
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, function(d) {
        return d3.max(d, function(d) {
          return d.y0 + d.y;
        });
      })])
      .range([height, margin.left]);

    // Create xScale
    var xScale = d3.scaleBand()
      .domain(dataset[0].map(function(d) {
        return d.x;
      }))
      .paddingInner(0.05)
      .paddingOuter(0.1)
      .range([margin.left, width]);

    // make the legend and the array for the names
    var object = vangsten[0]

    var names = ["bestand", "Aangeland", "Overboord gezet"]


    var colors = d3.scaleOrdinal()
      .domain(names)
      .range(d3.schemeSet2);


    // make the y axis
    var yAxis = d3.axisLeft()
      .scale(yScale);

    // make the x axis
    var xAxis = d3.axisBottom()
      .scale(xScale)

    // append the y axis
    stackedBar.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(yAxis);

    // append  the x axis
    stackedBar.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Create groups for each series, rects for each segment
    var groups = stackedBar.selectAll("g.cost")
      .data(dataset)
      .enter().append("g")
      .attr("class", "cost")
      .attr("fill", function(d, i) {
        return colors(i);
      });

    // make the rectangles for the bars
    var rect = groups.selectAll("rect")
      .data(function(d) {
        return d;
      })
      .attr("class", function(d) {})
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return xScale(d.x);
      })
      .attr("y", function(d) {
        return yScale(d.y0 + d.y);
      })
      .attr("height", function(d) {
        return yScale(d.y0) - yScale(d.y0 + d.y);
      })
      .attr("width", xScale.bandwidth())
      .on("mouseover", function() {
        tooltip.style("display", null);
      });

    // Draw legend
    var legend = stackedBar.selectAll(".legend")
      .data(names)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(30," + i * 19 + ")";
      });

    legend.append("rect")
      .attr("x", width - 160)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", function(d, i) {
        return colors(i);
      })

    legend.append("text")
      .attr("x", width - 140)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("fill", function(d, i) {
        return colors(i)
      })
      .text(function(d) {
        return d;
      })

    // Prep the tooltip bits, initial display is hidden
    var tooltip = stackedBar.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    tooltip.append("rect")
      .attr("width", 30)
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity", 0.5);

    tooltip.append("text")
      .attr("x", 15)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");
  };


  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
  function pickBarYear(year) {

    visbestand = visbestand[year]
    visvangst = visvangst[year]

    console.log(visbestand);
    console.log(visvangst);

    Object.keys(visvangst).forEach(key => {
      visvangst[key] = parseInt(visvangst[key], 10);
    })

    Object.keys(visbestand).forEach(key => {
      visbestand[key] = parseInt(visbestand[key], 10);
    })

    var vangsten = [{
        "soort": "Haring",
        "bestand": visbestand.Haring,
        "Aangeland": visvangst["Aangelande Haring "],
        "Overboord gezet": visvangst["Overboord gezette Haring "]
      },
      {
        "soort": "Kabeljauw",
        "bestand": visbestand.Kabeljauw,
        "Aangeland": visvangst["Aangelande Kabeljauw "],
        "Overboord gezet": visvangst["Overboord gezette Kabeljauw"]
      },
      {
        "soort": "Schol",
        "bestand": visbestand.Schol,
        "Aangeland": visvangst["Aangelande schol"],
        "Overboord gezet": visvangst["Overboord gezette Schol "]
      },
      {
        "soort": "Tong",
        "bestand": visbestand.Tong,
        "Aangeland": visvangst["Aangelande tong"],
        "Overboord gezet": visvangst["Overboord gezette tong"]
      }
    ]

    console.log(vangsten);
    return vangsten;


  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  function pickYear(year) {

    var bodemfauna = bodem[year]
    var zoogdieren = zoogdier[year]
    var vogels = vogel[year]
    var vissen = vissentrend[year]

    var bf = []
    try {
      Object.keys(bodemfauna).forEach(key => {
        if (bodemfauna[key] == null) {
          bodemfauna[key] = 0;
        }
        bf.push({
          "name": key,
          "size": bodemfauna[key]
        })
      })
    } catch (err) {
      return "error fauna"
    }

    var zd = []


    try {
      Object.keys(zoogdieren).forEach(key => {
        if (zoogdieren[key] == null) {
          zoogdieren[key] = 0;
        }
        zd.push({
          "name": key,
          "size": zoogdieren[key]
        })
      })
    } catch (err) {
      return "error zoogdieren"
    }

    var vg = []

    try {
      Object.keys(vogels).forEach(key => {
        if (vogels[key] == null) {
          vogels[key] = 0;
        }
        vg.push({
          "name": key,
          "size": vogels[key]
        })
      })
    } catch (err) {
      return "error vogels"
    }


    var vs = []
    try {
      Object.keys(vissen).forEach(key => {
        if (vissen[key] == null) {
          vissen[key] = 0;
        }
        vs.push({
          "name": key,
          "size": vissen[key]
        })
      })

    } catch (err) {
      return "error vissen"
    }

    var all = vs.concat(bf, vg, zd)

    var dieren = {
      "name": "diersoorten",
      // 'children' : all
      'children': [{
        'name': "vissen",
        "children": vs
      }, {
        'name': "bodemfauna",
        "children": bf
      }, {
        'name': "zoogdieren",
        "children": zd
      }, {
        'name': "vogels",
        "children": vg
      }]
    }
    return dieren;
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% //

  var dieren = pickYear('2000')

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var diameter = 400,
    format = d3.format(",d"),
    color = d3.scaleOrdinal(d3.schemeSet2);

  var bubble = d3.pack()
    .size([diameter, diameter])
    .padding(1.5);

  var svg = d3.select("#bubble"),
    margin = 20,
    diameter = +svg.attr("width"),
    g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

  var root = d3.hierarchy(classes(dieren))
    .sum(function(d) {
      return d.value;
    }).sort(function(a, b) {
      return b.value - a.value;
    });


  bubble(root);

  var node = svg.selectAll(".node")
    .data(root.children)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  node.append("title")
    .text(function(d) {
      return d.data.className + ": " + format(d.value);
    });

  node.append("circle")
    .transition()
    .duration(1000)
    .attr("r", function(d) {
      return d.r;
    })
    .style("fill", function(d) {
      return color(d.data.packageName);
    })

  node.selectAll("circle")
    .on("mouseover", function(d) {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(d.data.className)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 40) + "px");
    }).on("mouseout", function(d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    })
    .on('click', function(d) {
      console.log(d.data.className)
      console.log(d.data.packageName)
      updateLine([d.data.className, d.data.packageName])
    });


  // Returns a flattened hierarchy containing all leaf nodes under the root.
  function classes(root) {

    var classes = [];

    function recurse(name, node) {
      if (node.children) node.children.forEach(function(child) {
        recurse(node.name, child);
      });
      else classes.push({
        packageName: name,
        className: node.name,
        value: node.size
      });
    }

    recurse(null, root);
    return {
      children: classes
    };
  }
  d3.select(self.frameElement).style("height", diameter + "px");



  function updateCircle(year) {

    var dieren = pickYear(year)
    if (dieren == "error fauna") {
      console.log(dieren)
      return 1;
    } else if (dieren == "error zoogdieren") {
      console.log(dieren)
      return 1;
    } else if (dieren == "error vogels") {
      console.log(dieren)
      return 1;
    } else if (dieren == "error vissen") {
      console.log(dieren)
      return 1;
    }


    var root = d3.hierarchy(classes(dieren))
      .sum(function(d) {
        return d.value;
      })
      .sort(function(a, b) {
        return a.packageName;
      });

    bubble(root);

    // update the dots
    svg.selectAll(".node").data(root.children)
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })

    svg.selectAll("circle")
      .data(root.children)
      .transition()
      .duration(1500)
      .attr("r", function(d) {
        return d.r;
      }).style("fill", function(d) {
        return color(d.data.packageName);
      });


    // Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root) {
      var classes = [];

      function recurse(name, node) {
        if (node.children) node.children.forEach(function(child) {
          recurse(node.name, child);
        });
        else classes.push({
          packageName: name,
          className: node.name,
          value: node.size
        });
      }

      recurse(null, root);
      return {
        children: classes
      };
    }

    d3.select(self.frameElement).style("height", diameter + "px");
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


  function makeLineData(data) {
    console.log(data);
    lineData = []

    Object.keys(vogel).forEach(year => {
      lineData.push({
        year: year,
        y: vogel[year][data[0]]
      });
    });
    return lineData;
  }


  // 2. Use the margin convention practice
  var margin = {
      top: 25,
      right: 25,
      bottom: 35,
      left: 40
    },
    width = 600 - margin.left - margin.right // Use the window's width
    ,
    height = 300 - margin.top - margin.bottom; // Use the window's height

  // The number of datapoints
  var n = 26;

  // 5. X scale will use the index of our data
  var xScale = d3.scaleLinear()
    .domain([1990, 2016]) // input
    .range([0, width]); // output


  console.log(vissentrend);

  var dataset = makeLineData(["Noordse stormvogel", "vogels"])
  console.log(dataset);

  // 6. Y scale will use the randomly generate number
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) {
      return d.y;
    })]).range([height, 0]); // output

  min = d3.min(dataset, function(d) {
    return d.year;
  })

  var min = parseInt(min, 10);

  console.log(min);
  // 7. d3's line generator
  var line = d3.line()
    .x(function(d, i) {
      return xScale(i + min);
    }) // set the x values for the line generator
    .y(function(d) {
      return yScale(d.y);
    }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

  // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
  // var dataset = d3.range(n).map(function(d,i) { return {"y": d3.randomUniform(1)(), "x" : i + 1990} })
  // console.log(dataset);


  // 1. Add the SVG to the page and employ #2
  var linesvg = d3.select("body")
    .append("svg")
    .attr('class', "test")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // 3. Call the x axis in a group tag
  linesvg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d"))
      .ticks(20)).selectAll("text")
    .attr("y", 10)
    .attr("x", 5)
    .attr("dy", ".35em")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start"); // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  linesvg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  function make_x_gridlines() {
    return d3.axisBottom(xScale)
      .ticks(20)
  }

  // gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(yScale)
      .ticks(10)
  }

  linesvg.append("g")
    .attr("class", "x grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
      .tickSize(-height)
      .tickFormat("")
    )
    
  // add the Y gridlines
  linesvg.append("g")
    .attr("class", "y grid")
    .call(make_y_gridlines()
      .tickSize(-width)
      .tickFormat("")
    )

  // 9. Append the path, bind the data, and call the line generator
  linesvg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "lijn") // Assign a class for styling
    .attr("d", line); // 11. Calls the line generator


  // 12. Appends a circle for each datapoint
  linesvg.selectAll(".dot")
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
      this.attr('class', 'focus')
    })
    .on("mouseout", function() {})
  //     .on("mousemove", mousemove);
  //
  // var focus = svg.append("g")
  //     .attr("class", "focus")
  //     .style("display", "none");
  //
  // focus.append("circle")
  //     .attr("r", 4.5);
  //
  // focus.append("text")
  //     .attr("x", 9)
  //     .attr("dy", ".35em");
  //
  // svg.append("rect")
  //     .attr("class", "overlay")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .on("mouseover", function() { focus.style("display", null); })
  //     .on("mouseout", function() { focus.style("display", "none"); })
  //     .on("mousemove", mousemove);
  //
  // function mousemove() {
  //   var x0 = x.invert(d3.mouse(this)[0]),
  //       i = bisectDate(data, x0, 1),
  //       d0 = data[i - 1],
  //       d1 = data[i],
  //       d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  //   focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
  //   focus.select("text").text(d);}



  function updateLine(data) {

    var dataset = makeLineData(data)


    yScale.domain([0, d3.max(dataset, function(d) {
      return Math.ceil(d.y / 10) * 10;
    })])

    console.log(d3.max(dataset, function(d) {
      return Math.ceil(d.y / 10) * 10;
    }));

    min = d3.min(dataset, function(d) {
      return parseInt(d.year, 10);;
    })


    // 7. d3's line generator
    line
      .x(function(d, i) {
        return xScale(i + min);
      }) // set the x values for the line generator
      .y(function(d) {
        return yScale(d.y);
      }) // set the y values for the line generator
      .curve(d3.curveMonotoneX) // apply smoothing to the line


    // 4. Call the y axis in a group tag
    linesvg.selectAll(".y.axis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // add the Y gridlines
    linesvg.selectAll(".y.grid")
      .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
      )


    // 9. Append the path, bind the data, and call the line generator
    linesvg.selectAll("path")
      .datum(dataset)
      .transition()
      .duration(1000) // 10. Binds data to the line
      .attr("d", line); // 11. Calls the line generator

    linesvg.selectAll("circle")
      .data(dataset)
      .transition()
      .duration(1000)
      .attr("cx", function(d, i) {
        return xScale(i + min)
      })
      .attr("cy", function(d) {
        return yScale(d.y)
      })
      .attr("r", 5)


  }

};
