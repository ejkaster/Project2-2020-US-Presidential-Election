// Define SVG area dimensions
const svgWidth = 700;
const svgHeight = 500;

// Define the chart's margins as an object
const chartMargin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40
};

// Define dimensions of the chart area
const chartWidth = svgWidth - chartMargin.left - chartMargin.right;
const chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
const svg = d3.select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);


// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
const chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


  // Load data from project2_ MongoDB
const dataUrl = '/api/v1.0/states';

let electionData = []
d3.json(dataUrl).then(electionDataTmp => {
  console.log(electionDataTmp);
  electionDataTmp.forEach(function(data) {
    data.voteshare_inc = +data.voteshare_inc;
    })
   electionData = electionDataTmp;
// });

const barSpacing = 10;
const scaleY = 10;

// Create a 'barWidth' variable so that the bar chart spans the entire chartWidth
const barWidth = (chartWidth - (barSpacing * (electionData.length - 1))) / electionData.length;

// Create code to build bar chart using the electionData
chartGroup.selectAll(".bar")
  .data(electionData)
  .enter()
  .append("rect")
  .attr("x", (d,i) => i*(barSpacing+barWidth))
  .attr("y", 0)
  .attr("width", barWidth)
  .attr("height", d => d.voteshare_inc * scaleY);
}).catch(function(error) {
  console.log(error);
});



