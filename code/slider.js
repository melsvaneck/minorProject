function makeSlider(years,bodem, vissentrend, vogel, zoogdier) {
    // make the step slider per year, do the updateplot function on a change

    var height = document.getElementById("bubble").clientHeight;

    var sliderStep = d3
      .sliderLeft()
      .min(d3.min(years))
      .max(d3.max(years))
      .height(height-50)
      .tickFormat(d3.format('1'))
      .ticks(years.length)
      .step(1)
      .default(2016)
      .on('onchange', val => {
        d3.select('p#value-step').text(d3.format('1')(val));
        updateCircle(bodem, vissentrend, vogel, zoogdier, val);
      });

    var gStep = d3
      .select('div#slider-step')
      .append('svg')
      .attr('width', 100)
      .attr('height', height)
      .append('g')
      .attr("class", "slider")
      .attr('transform', 'translate(60,30)');

    gStep.call(sliderStep);

    d3.select('p#value-step').text(d3.format('1')(sliderStep.value()));

  }
