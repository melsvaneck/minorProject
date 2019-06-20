  function makeStackLine(bodem, vissentrend, vogel, zoogdier,data) {

    var margin = {
      top: 20,
      right: 30,
      bottom: 75,
      left: 60
    };

    var width = document.getElementById("stackline").clientWidth;
    var height = document.getElementById("stackline").clientHeight;

    var stackedLine = d3.select("#stackline")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(0,0)");

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

    // Add X axis label:
    stackedLine.append("text")
      .attr("text-anchor", "end")
      .attr("x", width - 100)
      .attr("y", height - 40)
      .text("Tijd (jaar)");

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

    stackedLine.selectAll(".x.axis .tick")
      .on("click", function(d) {
        updateCircle(bodem, vissentrend, vogel, zoogdier, d);
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
    var size = 10
    stackedLine.append("rect")
      .attr("x", (width - 105))
      .attr("y", margin.top)
      .attr("width", 105)
      .attr("height", 115)
      .style("fill", "	#F0F8FF")
      .style("opacity", "0.9")

    stackedLine.selectAll("myrect")
      .data(keys)
      .enter()
      .append("rect")
      .attr("x", (width * 0.760))
      .attr("y", function(d, i) {
        return 30 + i * (size + 5)
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
      .attr("x", (width * 0.760) + size * 1.2)
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
  };
