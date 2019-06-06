d3.json("/Data/vistechnieken.json").then(function(data) {
  // Setup margins,width and height
  var margin = {
    top: 20,
    right: 160,
    bottom: 35,
    left: 30
  };

  var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // make svg for the stacked bar chart
  var stackedBar = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Transpose the data into layers
  var dataset = d3.layout.stack()(["Boomkor", "Flyshoot", "Puls", "Sumwing", 'Garnalen', 'Diversen'].map(function(techniek) {
    return data.map(function(d) {
      return {
        x: d.Jaar,
        y: +d[techniek]
      };
    });
  }));

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

  // create color scaleBand
  var colors = d3.scale.category20();

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
    .attr("transform", "translate("+ margin.left + ",0)")
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
    })
    .on("mouseout", function() {
      tooltip.style("display", "none");
    })
    .on("mousemove", function(d) {
      var xPosition = d3.mouse(this)[0] - 15;
      var yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d.y);
    });

// make the legend and the array for the names
  var object = data[0]

  var names = []

  for(var property in object){
    if(property != 'Jaar'){
      names.push(property)
    }
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
    });


  legend.append("text")
    .attr("x", width -10)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d){
      return d;
    });

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

});
