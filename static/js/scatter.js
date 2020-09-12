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
const svg = d3.select("#bar-popular")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);


// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
const chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


  // Load data from project2_ MongoDB
const dataUrl = '../api/v1.0/states';

let electionData = []
d3.json(dataUrl).then(electionDataTmp => {
  console.log(electionDataTmp);
  electionDataTmp.forEach(function(data) {
    data.voteshare_inc = +data.voteshare_inc;
    })

  });




// // Read CSV
//   d3.csv('assets/data/data.csv').then(function(stateData){
//   console.log(stateData);


//        stateData.forEach(data => {
//         data.healthcare = +data.healthcare;
//         data.poverty = +data.poverty;
//       });
      
//         // set X-Scale to be linear
//         const xLinearScale = d3.scaleLinear()
//         .domain([(d3.min(stateData, d=> d.poverty)-2), d3.max(stateData, d => d.poverty)])  
//         .range([0, width]);     

//         //set Y-Scale to be linear
//         const yLinearScale = d3.scaleLinear()
//         .domain([(d3.min(stateData, d=> d.healthcare)-2), d3.max(stateData, d => d.healthcare)])
//         .range([height, 0]); 

//         // create axes
//         const xAxis = d3.axisBottom(xLinearScale);
//         const yAxis = d3.axisLeft(yLinearScale);

//         // append axes
//         chartGroup.append("g")
//         .attr("transform", `translate(0, ${height})`)
//         .call(xAxis);

//         chartGroup.append("g")
//         .call(yAxis);

//         // append circles
//         const circlesGroup = chartGroup.selectAll("circle")
//           .data(stateData)
//           .enter()
//           .append("circle")
//           .attr("cx", d => xLinearScale(d.poverty))
//           .attr("cy", d => yLinearScale(d.healthcare))
//           .attr("r", "20")
//           .classed("stateCircle", true)
//           .attr("opacity", "1");

//         const sliceData1 = stateData.slice(0,10);
//         const sliceData2 = stateData.slice(20,40);
//         const sliceData3 = stateData.slice(40,51);

//         sliceData1.forEach(data => {
//           data.poverty = +data.poverty;
//           data.healthcare = +data.healthcare;
//         });

//         // Data Binding
//         const textGroup = chartGroup.selectAll("null")
//           .data(stateData)
//           .enter()
//           .append("text")         
//           .attr("x", d => xLinearScale(d.poverty))
//           .attr("y", d => yLinearScale(d.healthcare-0.1))
//           .attr("font-size", "10px")
//           .text(d => d.abbr)
//           .classed("stateText", true);


    
//         // Axes formatting
//         chartGroup.append("text")
//           .attr("transform", "rotate(-90)")
//           .attr("y", 0 - margin.left)
//           .attr("x", 0 - (height / 2))
//           .attr("dy", "1em")
//           .classed('axisText', true)
//           .text("Lacks Healthcare (%)");

//         chartGroup.append("text")
//           .attr("transform", `translate(${(width / 2)}, ${height + margin.top -7 })`)
//           .attr("class", "axisText")
//           .classed('axisText', true)
//           .text("In Poverty (%)");

//         // Tooltips
//         // Step 1: Initialize Tooltip
//         const toolTip = d3.tip()
//         .attr("class", "tooltip")
//         .offset([80, 60])
//         .html(function (d) {
//           return (`<strong>${d.state}</strong><hr>Poverty: ${d.poverty}%<br/>Lacks Healthcare: ${d.healthcare}%`);
//         });

//         // Step 2: Create the tooltip in chartGroup.
//         chartGroup.call(toolTip);

//         // Step 3: Create "mouseover" event listener to display tooltip
//         circlesGroup.on("mouseover", function (d) {
//         toolTip.show(d, this);
//         })
//         // Step 4: Create "mouseout" event listener to hide tooltip
//         .on("mouseout", function (d) {
//           toolTip.hide(d);
//         });

  

//     }).catch(function (error) {
//       console.log(error);
        

//   });
// }

// // When the browser loads, makeResponsive() is called.
// makeResponsive();

// // When the browser window is resized, makeResponsive() is called.
// d3.select(window).on("resize", makeResponsive);