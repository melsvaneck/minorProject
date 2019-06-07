// d3.json("/Data/vistechnieken.json").then(function(data) {
//   console.log(data)
//
//   var margin = {
//     top: 20,
//     right: 160,
//     bottom: 35,
//     left: 30
//   };
//
//   var width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;
//
//   document.getElementById("bar").onclick = makeBar
//   document.getElementById("line").onclick = makeLine
//
//   function makeLine() {
//     d3.selectAll("svg").remove();
//     // append the svg object to the body of the page
//     var svg = d3.select("#my_dataviz")
//       .append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");
//     // List of groups = header of the csv files
//     var object = data[0]
//
//     var keys = []
//
//     for (var property in object) {
//       if (property != 'Jaar') {
//         keys.push(property)
//       }
//     }
//
//     // color palette
//     var color = d3.scaleOrdinal()
//       .domain(keys)
//       .range(d3.schemeSet2);
//
//     //stack the data?
//     var stackedData = d3.stack()
//       .keys(keys)
//       (data)
//
//     console.log(stackedData)
//
//
//     // Add X axis
//     var x = d3.scaleLinear()
//       .domain(d3.extent(data, function(d) {
//         return d.Jaar;
//       }))
//       .range([0, width]);
//
//     var xAxis = svg.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x).ticks(20))
//
//     // Add X axis label:
//     svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("x", width)
//       .attr("y", height + 30)
//       .text("Time (year)");
//
//     // Add Y axis label:
//     svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("x", 0)
//       .attr("y", -20)
//       .text("# of baby born")
//       .attr("text-anchor", "start")
//
//     // Add Y axis
//     var y = d3.scaleLinear()
//       .domain([0, d3.max(stackedData, function(d) {
//         return d3.max(d, function(d) {
//           return d[0] + 10;
//         });
//       })])
//       .range([height, margin.left]);
//     svg.append("g")
//       .call(d3.axisLeft(y).ticks(5))
//
//     //////////
//     // BRUSHING AND CHART //
//     //////////
//
//     // Add a clipPath: everything out of this area won't be drawn.
//     var clip = svg.append("defs").append("svg:clipPath")
//       .attr("id", "clip")
//       .append("svg:rect")
//       .attr("width", width)
//       .attr("height", height)
//       .attr("x", 0)
//       .attr("y", 0);
//
//
//     // Create the scatter variable: where both the circles and the brush take place
//     var areaChart = svg.append('g')
//       .attr("clip-path", "url(#clip)")
//
//     // Area generator
//     var area = d3.area()
//       .x(function(d) {
//         return x(d.data.Jaar);
//       })
//       .y0(function(d) {
//         return y(d[0]);
//       })
//       .y1(function(d) {
//         return y(d[1]);
//       })
//
//     // Show the areas
//     areaChart
//       .selectAll("mylayers")
//       .data(stackedData)
//       .enter()
//       .append("path")
//       .attr("class", function(d) {
//         return "myArea " + d.key
//       })
//       .style("fill", function(d) {
//         return color(d.key);
//       })
//       .attr("d", area)
//
//
//     var idleTimeout
//
//     function idled() {
//       idleTimeout = null;
//     }
//
//
//     // What to do when one group is hovered
//     var highlight = function(d) {
//       console.log(d)
//       // reduce opacity of all groups
//       d3.selectAll(".myArea").style("opacity", .5)
//       // expect the one that is hovered
//       d3.select("." + d).style("opacity", 1)
//     }
//
//     // And when it is not hovered anymore
//     var noHighlight = function(d) {
//       d3.selectAll(".myArea").style("opacity", 1)
//     }
//
//     // Add one dot in the legend for each name.
//     var size = 20
//     svg.selectAll("myrect")
//       .data(keys)
//       .enter()
//       .append("rect")
//       .attr("x", 800)
//       .attr("y", function(d, i) {
//         return 10 + i * (size + 5)
//       }) // 100 is where the first dot appears. 25 is the distance between dots
//       .attr("width", size)
//       .attr("height", size)
//       .style("fill", function(d) {
//         return color(d)
//       })
//       .on("mouseover", highlight)
//       .on("mouseleave", noHighlight)
//
//     // Add one dot in the legend for each name.
//     svg.selectAll("mylabels")
//       .data(keys)
//       .enter()
//       .append("text")
//       .attr("x", 800 + size * 1.2)
//       .attr("y", function(d, i) {
//         return 10 + i * (size + 5) + (size / 2)
//       }) // 100 is where the first dot appears. 25 is the distance between dots
//       .style("fill", function(d) {
//         return color(d)
//       })
//       .text(function(d) {
//         return d
//       })
//       .attr("text-anchor", "left")
//       .style("alignment-baseline", "middle")
//       .on("mouseover", highlight)
//       .on("mouseleave", noHighlight)
//
//
//   };
//
//   function makeBar() { // Setup margins,width and height
//     d3.selectAll("svg").remove();
//     // Transpose the data into layers
//     var dataset = d3.layout.stack()(["Boomkor", "Flyshoot", "Puls", "Sumwing", 'Garnalen', 'Diversen'].map(function(techniek) {
//       return data.map(function(d) {
//         return {
//           x: d.Jaar,
//           y: +d[techniek]
//         };
//       });
//     }));
//
//     // make svg for the stacked bar chart
//     var stackedBar = d3.select("body")
//       .append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//
//     // Create yScale
//     var yScale = d3.scaleLinear()
//       .domain([0, d3.max(dataset, function(d) {
//         return d3.max(d, function(d) {
//           return d.y0 + d.y;
//         });
//       })])
//       .range([height, margin.left]);
//
//     // Create xScale
//     var xScale = d3.scaleBand()
//       .domain(dataset[0].map(function(d) {
//         return d.x;
//       }))
//       .paddingInner(0.05)
//       .paddingOuter(0.1)
//       .range([margin.left, width]);
//     //
//     // // create color scaleBand
//     // var colors = d3.scale.schemeSet2();
//
//     // make the legend and the array for the names
//     var object = data[0]
//
//     var names = []
//
//     for (var property in object) {
//       if (property != 'Jaar') {
//         names.push(property)
//       }
//     }
//
//     var colors = d3.scaleOrdinal()
//       .domain(names)
//       .range(d3.schemeSet2);
//
//     var technieken = ["Boomkor", "Flyshoot", "Puls", "Sumwing", 'Garnalen', 'Diversen'];
//
//     // make the y axis
//     var yAxis = d3.axisLeft()
//       .scale(yScale);
//
//     // make the x axis
//     var xAxis = d3.axisBottom()
//       .scale(xScale)
//
//     // append the y axis
//     stackedBar.append("g")
//       .attr("class", "y axis")
//       .attr("transform", "translate(" + margin.left + ",0)")
//       .call(yAxis);
//
//     // append  the x axis
//     stackedBar.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis);
//
//     // Create groups for each series, rects for each segment
//     var groups = stackedBar.selectAll("g.cost")
//       .data(dataset)
//       .enter().append("g")
//       .attr("class", "cost")
//       .attr("fill", function(d, i) {
//         return colors(i);
//       });
//
//     // make the rectangles for the bars
//     var rect = groups.selectAll("rect")
//       .data(function(d) {
//         return d;
//       })
//       .attr("class", function(d) {
//
//       })
//       .enter()
//       .append("rect")
//       .attr("x", function(d) {
//         return xScale(d.x);
//       })
//       .attr("y", function(d) {
//         return yScale(d.y0 + d.y);
//       })
//       .attr("height", function(d) {
//         return yScale(d.y0) - yScale(d.y0 + d.y);
//       })
//       .attr("width", xScale.bandwidth())
//       .on("mouseover", function() {
//         tooltip.style("display", null);
//       });
//
//     // What to do when one group is hovered
//     var highlight = function(d) {
//       console.log(d)
//       // reduce opacity of all groups
//       d3.selectAll(".cost").style("opacity", .1)
//       // expect the one that is hovered
//       d3.select("." + d).style("opacity", 1)
//     }
//
//     // And when it is not hovered anymore
//     var noHighlight = function(d) {
//       d3.selectAll(".rect").style("opacity", 1)
//     }
//
//
//     // Draw legend
//     var legend = stackedBar.selectAll(".legend")
//       .data(names)
//       .enter().append("g")
//       .attr("class", "legend")
//       .attr("transform", function(d, i) {
//         return "translate(30," + i * 19 + ")";
//       });
//
//     legend.append("rect")
//       .attr("x", width - 30)
//       .attr("width", 18)
//       .attr("height", 18)
//       .attr("fill", function(d, i) {
//         return colors(i);
//       }).on("mouseover", highlight)
//       .on("mouseleave", noHighlight);
//
//
//     legend.append("text")
//       .attr("x", width - 10)
//       .attr("y", 9)
//       .attr("dy", ".35em")
//       .style("fill", function(d, i) {
//         return colors(i)
//       })
//       .text(function(d) {
//         return d;
//       }).on("mouseover", highlight)
//       .on("mouseleave", noHighlight);
//
//     // Prep the tooltip bits, initial display is hidden
//     var tooltip = stackedBar.append("g")
//       .attr("class", "tooltip")
//       .style("display", "none");
//
//     tooltip.append("rect")
//       .attr("width", 30)
//       .attr("height", 20)
//       .attr("fill", "white")
//       .style("opacity", 0.5);
//
//     tooltip.append("text")
//       .attr("x", 15)
//       .attr("dy", "1.2em")
//       .style("text-anchor", "middle")
//       .attr("font-size", "12px")
//       .attr("font-weight", "bold");
//   };
//
// });

function makeCircle () {

}
queue()
  .defer(d3.json, "Data/bodemFauna.json")
  .defer(d3.json, "Data/vissentrend.json")
  .defer(d3.json, "Data/vogels.json")
  .defer(d3.json, "Data/zoogdieren.json")
  .await(ready);

function ready(error, bodem, vissentrend, vogel, zoogdier) {

  function pickYear(year) {

    var bodemfauna = bodem[year]
    var zoogdieren = zoogdier[year]
    var vogels = vogel[year]
    var vissen = vissentrend[year]

    console.log(bodemfauna);
    console.log(zoogdieren);
    console.log(vogels);


    var bf = []

    Object.keys(bodemfauna).forEach(key => {
      bf.push({
        "name": key,
        "amount": bodemfauna[key]
      })
    })



    var zd = []

    Object.keys(zoogdieren).forEach(key => {
      zd.push({
        "name": key,
        "amount": zoogdieren[key]
      })
    })



    var vg = []

    Object.keys(vogels).forEach(key => {
      vg.push({
        "name": key,
        "amount": vogels[key]
      })
    })



    var vs = []

    Object.keys(vissen).forEach(key => {
      vs.push({
        "name": key,
        "amount": vissen[key]
      })
    })

    console.log(vs);
    console.log(bf);
    console.log(vg);
    console.log(zd);

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

    console.log(dieren);
    //////////////////////////////////////////////////////////////
    ////////////////// Create Set-up variables  //////////////////
    //////////////////////////////////////////////////////////////

    dataset = dieren

    var width = Math.max($("#chart").width(), 350) - 20,
      height = (window.innerWidth < 768 ? width : window.innerHeight - 20);

    var mobileSize = (window.innerWidth < 768 ? true : false);

    var centerX = width / 2,
      centerY = height / 2;
    //////////////////////////////////////////////////////////////
    /////////////////////// Create SVG  ///////////////////////
    //////////////////////////////////////////////////////////////

    //Create the visible canvas and context
    var canvas = d3.select("#chart").append("canvas")
      .attr("id", "canvas")
      .attr("width", width)
      .attr("height", height);
    var context = canvas.node().getContext("2d");
    context.clearRect(0, 0, width, height);

    //Create a hidden canvas in which each circle will have a different color
    //We can use this to capture the clicked on circle
    var hiddenCanvas = d3.select("#chart").append("canvas")
      .attr("id", "hiddenCanvas")
      .attr("width", width)
      .attr("height", height)
      .style("display", "none");
    var hiddenContext = hiddenCanvas.node().getContext("2d");
    hiddenContext.clearRect(0, 0, width, height);

    //Create a custom element, that will not be attached to the DOM, to which we can bind the data
    var detachedContainer = document.createElement("custom");
    var dataContainer = d3.select(detachedContainer);

    //////////////////////////////////////////////////////////////
    /////////////////////// Create Scales  ///////////////////////
    //////////////////////////////////////////////////////////////



    var colorCircle = d3.scale.ordinal()
      .domain([0, 1, 2])
      .range(['#003B46', '#07575B', '#66A5AD']);

    var diameter = Math.min(width * 0.9, height * 0.9);

    var pack = d3.layout.pack()
      .padding(1)
      .size([diameter, diameter])
      .value(function(d) {
        return d.amount;
      })
      .sort(function(d) {
        return d.amount;
      });

    //////////////////////////////////////////////////////////////
    ////////////////// Create Circle Packing /////////////////////
    //////////////////////////////////////////////////////////////

    var nodes = pack.nodes(dataset),
      root = dataset,
      focus = dataset;

    //Dataset to swtich between color of a circle (in the hidden canvas) and the node data
    var colToCircle = {};

    //Create the circle packing as if it was a normal D3 thing
    var dataBinding = dataContainer.selectAll(".node")
      .data(nodes)
      .enter().append("circle")
      .attr("id", function(d, i) {
        return "nodeCircle_" + i;
      })
      .attr("class", function(d, i) {
        return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
      })
      .attr("r", function(d) {
        console.log(d)
        return d.r;
      })
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("fill", function(d) {
        return d.children ? colorCircle(d.depth) : "white";
      });
    //.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });;

    //First zoom to get the circles to the right location
    zoomToCanvas(root);

    //////////////////////////////////////////////////////////////
    ///////////////// Canvas draw function ///////////////////////
    //////////////////////////////////////////////////////////////

    //The draw function of the canvas that gets called on each frame
    function drawCanvas(chosenContext, hidden) {

      //Clear canvas
      chosenContext.fillStyle = "#fff";
      chosenContext.rect(0, 0, canvas.attr("width"), canvas.attr("height"));
      chosenContext.fill();

      //Select our dummy nodes and draw the data to canvas.
      var elements = dataContainer.selectAll(".node");
      elements.each(function(d) {

        var node = d3.select(this);

        //If the hidden canvas was send into this function
        //and it does not yet have a color, generate a unique one
        if (hidden) {
          if (node.attr("color") === null) {
            // If we have never drawn the node to the hidden canvas get a new color for it and put it in the dictionary.
            node.attr("color", genColor());
            colToCircle[node.attr("color")] = node;
          } //if
          // On the hidden canvas each rectangle gets a unique color.
          chosenContext.fillStyle = node.attr("color");
        } else {
          chosenContext.fillStyle = node.attr("fill");
        } //else

        //Draw each circle
        chosenContext.beginPath();
        chosenContext.arc((centerX + +node.attr("cx")), (centerY + +node.attr("cy")), node.attr("r"), 0, 2 * Math.PI, true);
        chosenContext.fill();
        chosenContext.closePath();

      })
    } //function drawCanvas

    //////////////////////////////////////////////////////////////
    /////////////////// Click functionality //////////////////////
    //////////////////////////////////////////////////////////////

    // Listen for clicks on the main canvas
    document.getElementById("canvas").addEventListener("click", function(e) {
      // We actually only need to draw the hidden canvas when there is an interaction.
      // This sketch can draw it on each loop, but that is only for demonstration.
      drawCanvas(hiddenContext, true);

      //Figure out where the mouse click occurred.
      var mouseX = e.layerX;
      var mouseY = e.layerY;

      // Get the corresponding pixel color on the hidden canvas and look up the node in our map.
      // This will return that pixel's color
      var col = hiddenContext.getImageData(mouseX, mouseY, 1, 1).data;
      //Our map uses these rgb strings as keys to nodes.
      var colString = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
      var node = colToCircle[colString];

      if (node) {
        chosen = dataContainer.selectAll("#" + node.attr("id"))[0][0].__data__;
        //Zoom to the clicked on node
        if (focus !== chosen) zoomToCanvas(chosen);
        else zoomToCanvas(root);
      } //if
    });

    //////////////////////////////////////////////////////////////
    ///////////////////// Zoom Function //////////////////////////
    //////////////////////////////////////////////////////////////

    //Zoom into the clicked on circle
    //Use the dataContainer to do the transition on
    //The canvas will continuously redraw whatever happens to these circles
    function zoomToCanvas(d) {
      focus = d;
      var v = [focus.x, focus.y, focus.r * 2.05],
        k = diameter / v[2];

      dataContainer.selectAll(".node")
        .transition().duration(2000)
        .attr("cx", function(d) {
          return (d.x - v[0]) * k;
        })
        .attr("cy", function(d) {
          return (d.y - v[1]) * k;
        })
        .attr("r", function(d) {
          return d.r * k;
        });

    } //function zoomToCanvas

    //////////////////////////////////////////////////////////////
    //////////////////// Other Functions /////////////////////////
    //////////////////////////////////////////////////////////////

    //Generates the next color in the sequence, going from 0,0,0 to 255,255,255.
    //From: https://bocoup.com/weblog/2d-picking-in-canvas
    var nextCol = 1;

    function genColor() {
      var ret = [];
      // via http://stackoverflow.com/a/15804183
      if (nextCol < 16777215) {
        ret.push(nextCol & 0xff); // R
        ret.push((nextCol & 0xff00) >> 8); // G
        ret.push((nextCol & 0xff0000) >> 16); // B

        nextCol += 100; // This is exagerated for this example and would ordinarily be 1.
      }
      var col = "rgb(" + ret.join(',') + ")";
      return col;
    } //function genColor

    //////////////////////////////////////////////////////////////
    /////////////////////// Initiate /////////////////////////////
    //////////////////////////////////////////////////////////////

    //d3.timer(function() { drawCanvas(context) });
    function animate() {
      drawCanvas(context);
      window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);

    } //drawAll

  pickYear('2010')

  }


//
//   queue()
//     .defer(d3.json, "occupation.json")
//     .await(drawAll);
//
//   function drawAll(error, dataset) {
//
// }
