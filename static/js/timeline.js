// Step 1: Set up our chart
//= ================================
const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold chart,
// and shift the latter by left and top margins.
// =================================
const svg = d3.select("#timeline")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the MongoDB
// =================================
const dataUrl = '/api/v1.0/states';

const timeData = d3.json(dataUrl).then(timeData => {
    console.log(timeData[0]);
    console.log(timeData.length);
    

  // Step 4: Parse the data
  // Format the data and convert to numerical and date values
  // =================================
  // Create a function to parse date and time
  const parseTime = d3.timeParse("%d-%b");

  // Format the data
  timeData.forEach(function(data) {
    data.modeldate = parseTime(data.modeldate);
    data.voteshare_inc = +data.voteshare_inc;
    data.voteshare_chal = +data.voteshare_chal;
  });

  // Step 5: Create the scales for the chart
  // =================================
  const xTimeScale = d3.scaleTime()
    .domain(d3.extent(timeData, d => d.date))
    .range([0, width]);

  const yLinearScale = d3.scaleLinear().range([height, 0]);

  // Step 6: Set up the y-axis domain
  // ==============================================
  // determine the max y value
  // find the max of the voteshare_inc data
  const voteshare_incMax = d3.max(timeData, d => d.voteshare_inc);

  // find the max of the voteshare_chal data
  const voteshare_chalMax = d3.max(timeData, d => d.voteshare_chal);

  let yMax;
  if (voteshare_incMax > voteshare_chalMax) {
    yMax = voteshare_incMax;
  }
  else {
    yMax = voteshare_chalMax;
  }

  // const yMax = voteshare_incMax > voteshare_chalMax ? voteshare_incMax : voteshare_chalMax;

  // Use the yMax value to set the yLinearScale domain
  yLinearScale.domain([0, yMax]);


  // Step 7: Create the axes
  // =================================
  const bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%d-%b"));
  const leftAxis = d3.axisLeft(yLinearScale);

  // Step 8: Append the axes to the chartGroup
  // ==============================================
  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y-axis
  chartGroup.append("g").call(leftAxis);

  // Step 9: Set up two line generators and append two SVG paths
  // ==============================================

  // Line generator for voteshare_inc data
  const line1 = d3.line()
    .x(d => xTimeScale(d.modeldate))
    .y(d => yLinearScale(d.voteshare_inc));

  // Line generator for voteshare_chal data
  const line2 = d3.line()
    .x(d => xTimeScale(d.modeldate))
    .y(d => yLinearScale(d.voteshare_chal));

  // Append a path for line1
  chartGroup
    .append("path")
    .attr("d", line1(timeData))
    .classed("line red", true);

  // Append a path for line2
  chartGroup
    .data([timeData])
    .append("path")
    .attr("d", line2)
    .classed("line blue", true);

}).catch(function(error) {
  console.log(error);
});

// When the browser loads, makeResponsive() is called.
// makeResponsive();

// When the browser window is resized, makeResponsive() is called.
// d3.select(window).on("resize", makeResponsive);