function makeSlider(bodem, vissentrend, vogel, zoogdier, technieken) {

  // make an empty array for all the years
  var years = [];

  // get all the years from vistechnieken so the slider has the same amount of years
  technieken.forEach(function(d) {
    years.push(d.Jaar);
  });

  // get the height needed for the slider
  var height = document.getElementById("bubble").clientHeight;

  // make the slider variables
  var sliderStep = d3
    .sliderLeft()
    .min(d3.min(years))
    .max(d3.max(years))
    .height(height - 50)
    .tickFormat(d3.format('1'))
    .ticks(years.length)
    .step(1)
    .default(2016)
    // update the circle packing chart on every xhange to the new year
    .on('onchange', val => {
      d3.select('p#value-step').text(d3.format('1')(val));
      updateCircle(bodem, vissentrend, vogel, zoogdier, val);
    });

  // make the svg for the slider
  var gStep = d3
    .select('div#slider-step')
    .append('svg')
    .attr('width', 75)
    .attr('height', height)
    .append('g')
    .attr("class", "slider")
    .attr('transform', 'translate(60,30)');

  // call the slider
  gStep.call(sliderStep);

  d3.select('p#value-step').text(d3.format('1')(sliderStep.value()));

}
