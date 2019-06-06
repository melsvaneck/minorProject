
d3.json("/Data/vistechnieken.json").then(function(data) {
  console.log(data)

  var margin = {
    top: 20,
    right: 160,
    bottom: 35,
    left: 30
  };

  var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  document.getElementById("bar").onclick = makeBar
  document.getElementById("line").onclick = makeLine

  function makeLine() {
  d3.selectAll("svg").remove();
// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
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

      console.log(stackedData)


      // Add X axis
      var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.Jaar; }))
        .range([ 0, width ]);

      var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(20))

      // Add X axis label:
      svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", width)
          .attr("y", height+30 )
          .text("Time (year)");

      // Add Y axis label:
      svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", 0)
          .attr("y", -20 )
          .text("# of baby born")
          .attr("text-anchor", "start")

      // Add Y axis
      var y = d3.scaleLinear()
      .domain([0, d3.max(stackedData, function(d) {
        return d3.max(d, function(d) {
          return d[0] + 10;
        });
      })])
      .range([height, margin.left]);
      svg.append("g")
        .call(d3.axisLeft(y).ticks(5))

      //////////
      // BRUSHING AND CHART //
      //////////

      // Add a clipPath: everything out of this area won't be drawn.
      var clip = svg.append("defs").append("svg:clipPath")
          .attr("id", "clip")
          .append("svg:rect")
          .attr("width", width )
          .attr("height", height )
          .attr("x", 0)
          .attr("y", 0);


      // Create the scatter variable: where both the circles and the brush take place
      var areaChart = svg.append('g')
        .attr("clip-path", "url(#clip)")

      // Area generator
      var area = d3.area()
        .x(function(d) { return x(d.data.Jaar); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })

      // Show the areas
      areaChart
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
          .attr("class", function(d) { return "myArea " + d.key })
          .style("fill", function(d) { return color(d.key); })
          .attr("d", area)


      var idleTimeout
      function idled() { idleTimeout = null; }


        // What to do when one group is hovered
        var highlight = function(d){
          console.log(d)
          // reduce opacity of all groups
          d3.selectAll(".myArea").style("opacity", .5)
          // expect the one that is hovered
          d3.select("."+d).style("opacity", 1)
        }

        // And when it is not hovered anymore
        var noHighlight = function(d){
          d3.selectAll(".myArea").style("opacity", 1)
        }

        // Add one dot in the legend for each name.
        var size = 20
        svg.selectAll("myrect")
          .data(keys)
          .enter()
          .append("rect")
            .attr("x", 800)
            .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", function(d){ return color(d)})
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
          .data(keys)
          .enter()
          .append("text")
            .attr("x", 800 + size*1.2)
            .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return color(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)


  };

  function makeBar() { // Setup margins,width and height
    d3.selectAll("svg").remove();
    // Transpose the data into layers
    var dataset = d3.layout.stack()(["Boomkor", "Flyshoot", "Puls", "Sumwing", 'Garnalen', 'Diversen'].map(function(techniek) {
      return data.map(function(d) {
        return {
          x: d.Jaar,
          y: +d[techniek]
        };
      });
    }));

    // make svg for the stacked bar chart
    var stackedBar = d3.select("body")
      .append("svg")
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
    //
    // // create color scaleBand
    // var colors = d3.scale.schemeSet2();

    // make the legend and the array for the names
    var object = data[0]

    var names = []

    for (var property in object) {
      if (property != 'Jaar') {
        names.push(property)
      }
    }

    var colors = d3.scaleOrdinal()
      .domain(names)
      .range(d3.schemeSet2);

    var technieken = ["Boomkor", "Flyshoot", "Puls", "Sumwing", 'Garnalen', 'Diversen'];

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
      .attr("class", function(d){

      })
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

      // What to do when one group is hovered
      var highlight = function(d){
        console.log(d)
        // reduce opacity of all groups
        d3.selectAll(".cost").style("opacity", .1)
        // expect the one that is hovered
        d3.select("."+d).style("opacity", 1)
      }

      // And when it is not hovered anymore
      var noHighlight = function(d){
        d3.selectAll(".rect").style("opacity", 1)
      }


    // Draw legend
    var legend = stackedBar.selectAll(".legend")
      .data(names)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(30," + i * 19 + ")";
      });

    legend.append("rect")
      .attr("x", width - 30)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", function(d, i) {
        return colors(i);
      }).on("mouseover", highlight)
      .on("mouseleave", noHighlight);


    legend.append("text")
      .attr("x", width - 10)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("fill", function(d,i){ return colors(i)})
      .text(function(d) {
        return d;
      }).on("mouseover", highlight)
      .on("mouseleave", noHighlight);

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
});
