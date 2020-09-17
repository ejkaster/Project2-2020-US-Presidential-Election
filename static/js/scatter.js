//   // Define SVG area dimensions
const svgWidth = 960;
const svgHeight = 700;

// Define the chart's margins as an object
const margin = {
  top: 50,
  right: 75,
  bottom: 250,
  left: 75
};

// Define dimensions of the chart area
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  const svgArea = d3.select("body").select("svg");


  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  const svgWidth = window.innerWidth;
  const svgHeight = window.innerHeight;



}

const popVoteChart = async () => {
  //here is the code for my barchart
  const data = await (await fetch('/api/v1.0/states')).json();
  console.log(data);
  // Append SVG element
  const svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Avg for VPI
  const avgVPI = d3.mean(data, function (d) { return d.vpi; });
  // console.log(`VPI - avg:  ${avgVPI}`);

  //Avg for TPC
  const avgTipping = d3.mean(data, function (d) { return d.tipping; });
  // console.log(`Tipping - avg:  ${avgTipping * 100}`);

  // extract data from columns
  const summaryData = data.map(function (d) {

    return {
      state: d.state,
      vpi: +d.vpi,
      tipping: +d.tipping
    };
  });
  console.log(summaryData[0]);

  // Group by state and average by state
  const stateMetrics = d3.nest()
    .key(function (d) { return d.state; })
    .rollup(function (v) {
      return {
        avgVPI: +d3.mean(v, function (d) { return d.vpi; }),
        avgTipping: +d3.mean(v, function (d) { return d.tipping * 100; })
      };
    })
    .entries(summaryData);
  console.log(stateMetrics);

  let i = 24
  const cleanedStateData = stateMetrics.slice(0, i).concat(stateMetrics.slice(i + 1, stateMetrics.length))
  // console.log(cleanedStateData); 

  i = 24
  const cleanedStateData1 = cleanedStateData.slice(0, i).concat(cleanedStateData.slice(i + 1, cleanedStateData.length))
  // console.log(cleanedStateData1); 

  i = 24
  const cleanedStateData2 = cleanedStateData1.slice(0, i).concat(cleanedStateData1.slice(i + 1, cleanedStateData1.length))
  // console.log(cleanedStateData2); 

  i = 32
  const cleanedStateData3 = cleanedStateData2.slice(0, i).concat(cleanedStateData2.slice(i + 1, cleanedStateData2.length))
  // console.log(cleanedStateData3); 

  i = 32
  const stateSummary = cleanedStateData3.slice(0, i).concat(cleanedStateData3.slice(i + 1, cleanedStateData3.length))
  console.log(stateSummary.reverse());

  // x scale
  const xLinearScale = d3.scaleLinear()
    .domain([(d3.min(stateSummary, d => d.value.avgVPI) - 2), d3.max(stateSummary, d => d.value.avgVPI)])
    .range([0, chartWidth]);

  // y scale
  const yLinearScale = d3.scaleLinear()
    .domain([(d3.min(stateSummary, d => d.value.avgTipping) - 2), d3.max(stateSummary, d => d.value.avgTipping)])
    .range([chartHeight, 0]);

  // create and customize axes
  const xAxis = d3.axisBottom(xLinearScale);
  const yAxis = d3.axisLeft(yLinearScale);

  // append axes
  chartGroup.append('g').call(xAxis)
    .attr('transform', `translate(0, ${chartHeight})`)
    .selectAll('text')
    // .attr('transform', 'translate(-10,10)rotate(-45)')
    .style('text-anchor', 'end')
    .style('font-size', 12)
    .style('fill', 'white');

  chartGroup.append('g').call(yAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .style('font-size', 12)
    .style('fill', 'white');

  // append circles
  const circlesGroup = chartGroup.selectAll('circle')
    .data(stateSummary)
    .enter()
    .append('circle')
    .attr('fill', 'red')
    .attr('opacity', '.5')
    .attr("cx", d => xLinearScale(d.value.avgVPI))
    .attr("cy", d => yLinearScale(d.value.avgTipping))
    .attr("r", "15")
    .classed("stateCircle", true)
    .on('mouseover', function () {
      tooltip.style('display', null);
    })
    .on('mouseout', function () {
      tooltip.style('display', 'none');
    })
    .on('mousemove', function (d) {
      var xPos = d3.mouse(this)[0] - 75;
      var yPos = d3.mouse(this)[1] - 50;
      tooltip.attr('transform', 'translate(' + xPos + ',' + yPos + ')');
      tooltip.select('text').text(`${d.key} - VPI: ${d.value.avgVPI} & Tipping Point Chance: ${d.value.avgTipping}`)
    });

  // Data Binding
  const textGroup = chartGroup.selectAll("null")
    .data(stateSummary)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.value.avgVPI))
    .attr("y", d => yLinearScale(d.value.avgTipping - 0.1))
    .attr("font-size", "10px")
    .text(d => d.key)
    .classed("stateText", true)
    .attr('fill', 'white')
    ;

  // Axes formatting
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .classed('axisText', true)
    .text("Tipping Point Chance")
    .attr('fill', 'white');

  chartGroup.append("text")
    .attr("transform", `translate(${(chartWidth / 2)}, ${chartHeight + margin.top + 20})`)
    .attr("class", "axisText")
    .classed('axisText', true)
    .text("Voting Power Index")
    .attr('fill', 'white');


  const tooltip = chartGroup.append('g')
    .style('display', 'none')
    .style('background-color', 'white')
    .style('border', 'solid')
    .style('border-width', '2px')
    .style('border-radius', '5px')
    .style('padding', '5px');

  tooltip.append('text')
    .attr('x', 15)
    .attr('dy', '1.2em')
    .style('font-size', '13')
    .style('fill', 'white')
    .attr('font-weight', 'bold');

}

popVoteChart();





// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
