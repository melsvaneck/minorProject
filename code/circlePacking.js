function makeCirclePacking(bodem, vissentrend, vogel, zoogdier) {

  var dieren = pickYear(bodem, vissentrend, vogel, zoogdier, '2016');
  year = "2016"
  var margin = 20;
  var diameter = document.getElementById("bubble").clientHeight;

  var circPack = d3.select("#bubble")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)

  g = circPack.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

  var color = d3.scaleOrdinal()
    .domain([0, 1, 2])
    .range(["#012172", "0486DB", "#05ACD3"])

  var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  root = d3.hierarchy(dieren)
    .sum(function(d) {
      return d.size;
    })
    .sort(function(a, b) {
      return b.value - a.value;
    });

  var focus = root,
    nodes = pack(root).descendants(),
    view;

  var circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("class", function(d) {
      return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
    })
    .style("fill", function(d) {
      return d.children ? color(d.depth) : null;
    })
    .on("click", function(d) {
      if (d.depth == 2) {
        updateLine([d.data.name, d.parent.data.name], bodem, vissentrend, vogel, zoogdier);
      } else if (focus !== d) zoom(d), d3.event.stopPropagation();
    }).on("mouseover", function(d) {
      if (d.depth >= 2) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(d.data.name)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 40) + "px");
    }})
    .on("mouseout", function(d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });

  circPack.append("text")
  .attr("class", "bigtext")
  .style("font", "24px sans-serif")
  .attr("text-anchor", "start")
  .attr("x", 1)
  .attr("y", 50)
  .text("Trend van diersoorten in " + year + "");


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
        }
    ).style("font-size", function(d) {
      var len = d.data.name.length;
          var size = d.r/3;
          size *= 10 / len;
          size += 3;
          return Math.round(size)+'px';
      })

  var node = g.selectAll("circle,text");

  circPack.style("background", "	#F0F8FF")
    .on("click", function() {
      zoom(root);
    });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoomTo(v) {
    var k = diameter / v[2];
    view = v;

    node.attr("transform", function(d) {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    text.attr("transform", function(d) {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    })
    circle.attr("r", function(d) {
      return d.r * k;
    });
  }

  function zoom(d) {
    var focus0 = focus;
    focus = d;

    var transition = d3.transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween("zoom", function(d) {
        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return function(t) {
          zoomTo(i(t));
        };
      });

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


function updateCircle(bodem, vissentrend, vogel, zoogdier, year) {
  var margin = 20
  var diameter = document.getElementById("bubble").clientHeight;
  var dieren = pickYear(bodem, vissentrend, vogel, zoogdier, year)

  var color = d3.scaleOrdinal()
    .domain([0, 1, 2])
    .range(["#012172", "0486DB", "#05ACD3"])

  var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

  root = d3.hierarchy(dieren)
    .sum(function(d) {
      return d.size;
    })
    .sort(function(a, b) {
      return b.value - a.value;
    });

  var focus = root,
    nodes = pack(root).descendants(),
    view;

  var circle = g.selectAll("circle")
    .data(nodes)
    .attr("class", function(d) {
      return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
    })
    .style("fill", function(d) {
      return d.children ? color(d.depth) : null;
    })

    d3.select(".bigtext")
    .transition()
    .duration(500)
    .text(year)

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
        }
    ).style("font-size", function(d) {
      var len = d.data.name.length;
          var size = d.r/3;
          size *= 10 / len;
          size += 3;
          return Math.round(size)+'px';
      })

  var node = g.selectAll("circle,text");

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoomTo(v) {
    var k = diameter / v[2];
    view = v;

    node.attr("transform", function(d) {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    text.attr("transform", function(d) {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    })
    circle.attr("r", function(d) {
      return d.r * k;
    });

    function zoom(d) {
      var focus0 = focus;
      focus = d;

      var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return function(t) {
            zoomTo(i(t));
          };
        });

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
}



function pickYear(bodem, vissentrend, vogel, zoogdier, year) {

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
  } catch (err) {}

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
  } catch (err) {}

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
  } catch (err) {}


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
  } catch (err) {}


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
  }

  return dieren;
}
