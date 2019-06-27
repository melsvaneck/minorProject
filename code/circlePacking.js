// Name: Mels van eck
// Student number 500757609
// This program makes an updatable circle packing chart using the d3 library


function makeCirclePacking(bodem, vissentrend, vogel, zoogdier) {

  // choosing the first year
  var year = "2016";

  // prepare the data for the chosen year.
  var dieren = pickYear(bodem, vissentrend, vogel, zoogdier, year);

  // make a margin
  var margin = 5;

  // get the diameter size from the div
  var diameter = document.getElementById("bubble").clientHeight;

  // append the svg to the div
  var circPack = d3.select("#bubble")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter);

  // make the g element an place it in the middle
  g = circPack.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

  // color scaling
  var color = d3.scaleOrdinal()
    .domain([0, 1, 2])
    .range(["#012172", "0486DB", "#05ACD3"]);

  // vreate pack layout
  var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

  // make a div for the tooltip
  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // structure the data witth hierarchy function
  var root = d3.hierarchy(dieren)
    .sum(function(d) {
      return d.size;
    })
    .sort(function(a, b) {
      return b.value - a.value;
    });


  var focus = root,
    nodes = pack(root).descendants(),
    view;

  // append circles
  var circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("class", function(d) {
      return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
    })
    .style("fill", function(d) {
      return d.children ? color(d.depth) : null;
    })
    // if the  click is on a small single circle: update the line chart
    // else zoom in to the fille circle
    .on("click", function(d) {
      if (d.depth == 2) {
        updateLine([d.data.name, d.parent.data.name], bodem, vissentrend, vogel, zoogdier);
      } else if (focus !== d) zoom(d), d3.event.stopPropagation();
    })
    // if the hover is over a small single circle, show the name
    .on("mouseover", function(d) {
      if (d.depth >= 2) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(d.data.name)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 40) + "px");
      }
    })
    .on("mouseout", function(d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });

  // append the graph desription text
  circPack.append("text")
    .attr("class", "bigtext")
    .style("font", "18px sans-serif")
    .attr("text-anchor", "start")
    .attr("x", 1)
    .attr("y", 20)
    .text("Trend van diersoorten in " + year + "");

  // append the text for the circles
  var text = g.selectAll("text")
    .data(nodes)
    .enter().append("text")
    // .style("font"," sans-serif")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .attr("class", "label")
    .style("fill-opacity", function(d) {
      return d.parent === root ? 1 : 0;
    })
    .style("display", function(d) {
      return d.parent === root ? "inline" : "none";
    }).text(function(d) {
      return d.data.name;
    })
    // change text size according to size of the circles
    .style("font-size", function(d) {
      var len = d.data.name.length;
      var size = d.r / 3;
      size *= 10 / len;
      size += 3;
      return Math.round(size) + 'px';
    });

  // make a variabe for the text and circles
  var node = g.selectAll("circle,text");

  // add click function and backgroud color
  circPack.style("background", "	#F0F8FF")
    .on("click", function() {
      zoom(root);
    });

  // zoom to normal view
  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoomTo(v) {
    // make k-factor for sizing
    var k = diameter / v[2];

    view = v;

    // add position to circles and text
    node.attr("transform", function(d) {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    text.attr("transform", function(d) {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    // add radius to the circles
    circle.attr("r", function(d) {
      return d.r * k;
    });
  }

  function zoom(d) {
    var focus0 = focus;
    focus = d;

    // make variable for the transition
    var transition = d3.transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween("zoom", function(d) {
        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return function(t) {
          zoomTo(i(t));
        };
      });

    // show all the circle texts acoording to where te zoom went to
    transition.selectAll("text").filter('.label')
      .filter(function(d) {
        return d.parent === focus || this.style.display === "inline";
      })
      .style("fill-opacity", function(d) {
        return d.parent === focus ? 1 : 0;
      })
      .on("start", function(d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .on("end", function(d) {
        if (d.parent !== focus) this.style.display = "none";
      });

  }
}

// function to update the circle according to the chosen year
function updateCircle(bodem, vissentrend, vogel, zoogdier, year) {

  // make a margin again
  var margin = 5;

  // get the height for diameter
  var diameter = document.getElementById("bubble").clientHeight;

  // get the data of the chosen year
  var dieren = pickYear(bodem, vissentrend, vogel, zoogdier, year);

  // make color scaling again
  var color = d3.scaleOrdinal()
    .domain([0, 1, 2])
    .range(["#012172", "0486DB", "#05ACD3"]);

  //  make pack variable for the circles
  var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

  // make the right hierarchy for the data
  var root = d3.hierarchy(dieren)
    .sum(function(d) {
      return d.size;
    })
    .sort(function(a, b) {
      return b.value - a.value;
    });

  var focus = root,
    nodes = pack(root).descendants(),
    view;

  // update chircles
  var circle = g.selectAll("circle")
    .data(nodes)
    .attr("class", function(d) {
      return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
    })
    .style("fill", function(d) {
      return d.children ? color(d.depth) : null;
    });

  // update the chart name by year
  d3.select(".bigtext")
    .transition()
    .duration(500)
    .text("Trend van diersoorten in " + year + "");

  // update all the texts
  var text = g.selectAll("text")
    .data(nodes)
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .attr("class", "label")
    .style("fill-opacity", function(d) {
      return d.parent === root ? 1 : 0;
    })
    .style("display", function(d) {
      return d.parent === root ? "inline" : "none";
    }).text(function(d) {
      return d.data.name;
    }).style("font-size", function(d) {
      var len = d.data.name.length;
      var size = d.r / 3;
      size *= 10 / len;
      size += 3;
      return Math.round(size) + 'px';
    });

  var node = g.selectAll("circle,text");

  // zoom to normal view
  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoomTo(v) {
    // make k-factor for sizing
    var k = diameter / v[2];
    view = v;

    // change diameter
    node.attr("transform", function(d) {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    text.attr("transform", function(d) {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });

    circle.attr("r", function(d) {
      return d.r * k;
    });
  }
}

function pickYear(bodem, vissentrend, vogel, zoogdier, year) {

  // make bojects of the selected year per species
  var bodemfauna = bodem[year];
  var zoogdieren = zoogdier[year];
  var vogels = vogel[year];
  var vissen = vissentrend[year];

  // make array for the species
  var bf = [];

  // parse the object and format the data the right way for the hierarchy
  Object.keys(bodemfauna).forEach(key => {
    if (bodemfauna[key] == null) {
      bodemfauna[key] = 0;
    }
    bf.push({
      "name": key,
      "size": bodemfauna[key]
    });
  });

  // make array for the species (zd stands vooor zoogdieren)
  var zd = [];

  // parse the object and format the data the right way for the hierarchy
  Object.keys(zoogdieren).forEach(key => {
    if (zoogdieren[key] == null) {
      zoogdieren[key] = 0;
    }
    zd.push({
      "name": key,
      "size": zoogdieren[key]
    });
  });

  // make array for the species
  var vg = [];

  // parse the object and format the data the right way for the hierarchy
  Object.keys(vogels).forEach(key => {
    if (vogels[key] == null) {
      vogels[key] = 0;
    }
    vg.push({
      "name": key,
      "size": vogels[key]
    });
  });

  // make array for the species
  var vs = [];

  // parse the object and format the data the right way for the hierarchy
  Object.keys(vissen).forEach(key => {
    if (vissen[key] == null) {
      vissen[key] = 0;
    }
    vs.push({
      "name": key,
      "size": vissen[key]
    });
  });

  // add all the arrays together to one usable dataset
  var dieren = {
    "name": "diersoorten",
    'children': [{
      'name': "vissen",
      "children": vs
    }, {
      'name': "zoogdieren",
      "children": zd
    }, {
      'name': "bodemfauna",
      "children": bf
    }, {
      'name': "vogels",
      "children": vg
    }]
  };

  return dieren;
}
