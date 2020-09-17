//############################ CHART 1 - ELECTORAL MULTI-BAR CHART  #####################################
const electoralVoteChart = async () => {
  //here is the code for my barchart
  const data = await (await fetch('/api/v1.0/national')).json();
  console.log(data);
  // Define SVG area dimensions
const svgWidth3 = 860;
const svgHeight3 = 700;

// Define the chart's margins as an object
const chartMargin3 = {
    top: 50,
    right: 75,
    bottom: 200,
    left: 75
  };

// Define dimensions of the chart area
const chartWidth3 = svgWidth3 - chartMargin3.left - chartMargin3.right;
const chartHeight3 = svgHeight3 - chartMargin3.top - chartMargin3.bottom;


// Select div-id=bar-popular, append SVG area to it, and set the dimensions
const svg3 = d3.select("#bar-electoral")
    .append("svg")
    .attr("height", svgHeight3)
    .attr("width", svgWidth3);


// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
const chartGroup3 = svg3.append("g")
    .attr("transform", `translate(${chartMargin3.left}, ${chartMargin3.top})`);

// Filter for last month of data
const lastMonth = data.filter(function (d) { return d.modeldate > '8/1/20'; });
console.log(lastMonth);

const lastMonthR = lastMonth.map(function(d,i) {

  return {
    modeldate: d.modeldate,
    Trump: +Math.round(d.ev_inc),
    Biden: +Math.round(d.ev_chal)
  };
});
console.log(lastMonthR[0]);

// List of subgroups - headers
const subgroups = d3.keys(lastMonthR[0]).filter(function (d) {
      return d != "modeldate" && d != "_id";      
    });
console.log(subgroups.reverse);


// List of groups =  value of the first column called date -> I show them on the X axis
const groups = d3.map(lastMonthR, function (d) { return (d.modeldate) }).keys()
console.log(groups);

// Add X axis
// The scale spacing the groups:
const x0 = d3.scaleBand()
      .rangeRound([0, chartWidth3])
      .paddingInner(0.085);

// The scale for spacing each group's bar:
const x1 = d3.scaleBand()
      .padding(0.08);

const y = d3.scaleLinear()
      .rangeRound([chartHeight3, 0]);

// color palette = one color per subgroup
    const z = d3.scaleOrdinal()
      .range(["red", "lightblue"]);

    x0.domain(lastMonthR.map(function (d) { return d.modeldate; }));
    x1.domain(subgroups).rangeRound([0, x0.bandwidth()]);
    y.domain([0, 400]);

// Show the bars
    chartGroup3.append("g")
      .selectAll("g")
      .data(lastMonthR)
      .enter().append("g")
      .attr("transform", function (d) { return "translate(" + x0(d.modeldate) + ",0)"; })
      .style('fill', 'white')
      .selectAll("rect")
      .data(function (d) { return subgroups.map(function(key) { return { key: key, value: d[key] }; }); })
      .enter().append("rect")
      .attr("x", function (d) { return x1(d.key); })
      .attr("y", function (d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function (d) { return chartHeight3 - y(d.value); })
      .attr("fill", function (d) { return z(d.key); });


    chartGroup3.append("g")
      .attr("transform", "translate(0," + chartHeight3 + ")")
      .attr('fill', 'white')
      .call(d3.axisBottom(x0))
      .selectAll('text')
      .attr('transform', 'translate(-10,10)rotate(-90)')
      .style('text-anchor', 'end')
      .style('font-size', 14)
      .style('fill', 'white');

    chartGroup3.append("g")
      .attr("class", "y axis")
      .attr('fill', 'white')
      .call(d3.axisLeft(y).ticks(20))
      .selectAll('text')
      .style('text-anchor', 'end')
      .style('font-size', 12)
      .style('fill', 'white')
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .style("fill", "white")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Electoral Vote Count");

// Y axis label:
    chartGroup3.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -chartMargin3.left + 20)
      .attr("x", -chartMargin3.top - 50)
      .text("Electoral Vote Count")
      .attr('fill', 'white');

// Add chart title:
    chartGroup3.append("text")
      .attr("x", (chartWidth3 / 2))
      .attr("y", 0 - (chartMargin3.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .attr('fill', 'white')
      .text("Forecasted Electoral Vote Count");


const legend = chartGroup3.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(subgroups.slice().reverse())
      .enter().append("g")
      .attr("transform", function (d, i) { return "translate(0," + i * 30 + ")"; });
    legend.append("rect")
      .attr("x", chartWidth3 - 15)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", z)
      .attr("stroke", z)
      .attr("stroke-width", 2);

    legend.append("text")
      .attr("x", chartWidth3 - 24)
      .attr("y", 12)
      .attr("dy", "0.32em")
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .text(function (d) { return d; });

}
electoralVoteChart();


// ####################### CHART 1 - POPULAR (TRUMP) #######################################
const popularVote = async () => {
  //here is the code for my barchart
  const data1 = await (await fetch('/api/v1.0/popular')).json();
  console.log(data1);

// Define SVG area dimensions
const svgWidth1 = 600;
const svgHeight1 = 700;

// Define the chart's margins as an object
const chartMargin1 = {
  top: 50,
  right: 50,
  bottom: 200,
  left: 50
};

// Define dimensions of the chart area
const chartWidth1 = svgWidth1 - chartMargin1.left - chartMargin1.right;
const chartHeight1 = svgHeight1 - chartMargin1.top - chartMargin1.bottom;


// Select div-id=bar-popular, append SVG area to it, and set the dimensions
const svg1 = d3.select("#bar-popular")
  .append("svg")
  .attr("height", svgHeight1)
  .attr("width", svgWidth1);

//  Append a group to the SVG area and shift ('translate') it to the right and to the bottom
const chartGroup1 = svg1.append("g")
  .attr("transform", `translate(${chartMargin1.left}, ${chartMargin1.top})`);

// // // Load data from project2_ MongoDB
// // const dataUrl1 = '/api/v1.0/states';

// // const electionData1 = d3.json(dataUrl1).then(electionData1 => {
// //               console.log(electionData1[0]);
// //               console.log(electionData1.length);

// // //  Min, Max for both candidates
// const voterangeTrump = d3.extent(data, function(d) { return d.voteshare_inc; });
//               console.log(`Trump - min and max:  ${voterangeTrump}`);

// const voterangeBiden = d3.extent(data, function(d) { return d.voteshare_chal; });
//               console.log(`Biden - min and max:  ${voterangeBiden}`);

// Avg for both candidates as of 9/4/2020 nationwide
const avgTrump = d3.mean(data1, function(d) { return d.voteshare_inc; });
console.log(`Trump - avg:  ${avgTrump}`);

const avgBiden = d3.mean(data1, function(d) { return d.voteshare_chal; });
console.log(`Biden - avg:  ${avgBiden}`);


// Group by state and % average by state for each candidate
const stateMetrics = d3.nest()
  .key(function(d) { return d.state; })
  .rollup(function(v) { return {
    avgTrump: +d3.mean(v, function(d) { return d.voteshare_inc; }),
    avgBiden: +d3.mean(v, function(d) { return d.voteshare_chal; })
  }; 
})
  .entries(data1);
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


//Create scales
// x scale
let xScale = d3.scaleBand()
              .domain(stateSummary.map(row=>row.key))
              .range([0, chartWidth1])
              .paddingInner(.5);

// y scale
let yScale = d3.scaleLinear()
              .domain([0, 100])
              .range([chartHeight1, 0]);

// create and customize axes
let xAxis = d3.axisBottom(xScale);

let yAxis = d3.axisLeft(yScale).ticks(10);


// render axes with .call
chartGroup1.append('g')
            .call(xAxis)
            .attr('transform', `translate(0, ${chartHeight1})`)
                .selectAll('text')
                .attr('transform', 'translate(-10,10)rotate(-90)')
                .style('text-anchor', 'end')
                .style('font-size', 12)
                .style('fill', 'white');


chartGroup1.append('g').call(yAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .style('font-size', 12)
            .style('fill', 'white');

// create svg rectangle per piece of data
chartGroup1.selectAll('rect')
    .data(stateSummary)
    .enter()
    .append('rect')
    .attr('fill', 'red')
    // .attr('opacity', '.75')
    .attr('x', d => xScale(d.key))
    .attr('y', d => yScale(d.value.avgTrump))
    .attr('width', xScale.bandwidth())
    .attr('height', d => chartHeight1 - yScale(d.value.avgTrump))
    .on('mouseover', function (){
        tooltip.style('display', null);
    })
    .on('mouseout', function() {
        tooltip.style('display', 'none');
    })
    .on('mousemove', function (d) {
        var xPos = d3.mouse(this)[0] - 75;
        var yPos = d3.mouse(this)[1] - 50; 
        tooltip.attr('transform', 'translate(' + xPos + ',' + yPos + ')');
        tooltip.select('text').text(d.key + ':' + d.value.avgTrump + '%');


});      


// Y axis label:
chartGroup1.append("text")
.attr("text-anchor", "end")
.attr("transform", "rotate(-90)")
.attr("y", -chartMargin1.left+20)
.attr("x", -chartMargin1.top-100)
.text("Vote Share (%)")
.attr('fill', 'white');

// Add chart title:
chartGroup1.append("text")
        .attr("x", (chartWidth1 / 2))             
        .attr("y", 0 - (chartMargin1.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .style('font-weight', 'bold')  
        .attr('fill', 'white')
        .text("Forecasted popular vote share by state - Trump");

const tooltip = chartGroup1.append('g')
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
popularVote();


// ####################### CHART 1 - POPULAR (TRUMP) #######################################
const popularVote2 = async () => {
  //here is the code for my barchart
  const data2 = await (await fetch('/api/v1.0/popular')).json();
  console.log(data2);

 // Define SVG area dimensions
const svgWidth = 600;
const svgHeight = 700;

// Define the chart's margins as an object
const chartMargin = {
top: 50,
right: 50,
bottom: 200,
left: 50
};

// Define dimensions of the chart area
const chartWidth = svgWidth - chartMargin.left - chartMargin.right;
const chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select div-id=bar-popular, append SVG area to it, and set the dimensions
const svg2 = d3.select("#bar-popular")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
const chartGroup2 = svg2.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Group by state and % average by state for each candidate
const stateMetrics2 = d3.nest()
  .key(function(d) { return d.state; })
  .rollup(function(v) { return {
    avgTrump: +d3.mean(v, function(d) { return d.voteshare_inc; }),
    avgBiden: +d3.mean(v, function(d) { return d.voteshare_chal; })
  }; 
})
  .entries(data2);
console.log(stateMetrics2);

let i = 24
const cleanedStateData = stateMetrics2.slice(0, i).concat(stateMetrics2.slice(i + 1, stateMetrics2.length))
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
const stateSummary2 = cleanedStateData3.slice(0, i).concat(cleanedStateData3.slice(i + 1, cleanedStateData3.length))
console.log(stateSummary2.reverse()); 

// Create scales
// x scale
let xScale = d3.scaleBand()
              .domain(stateSummary2.map(row=>row.key))
              .range([0, chartWidth])
              .paddingInner(.5);

// y scale
let yScale = d3.scaleLinear()
              .domain([0, 100])
              .range([chartHeight, 0]);

// create and customize axes
let xAxis = d3.axisBottom(xScale);

let yAxis = d3.axisLeft(yScale).ticks(10);


// render axes with .call
chartGroup2.append('g')
            .call(xAxis)
            .attr('transform', `translate(0, ${chartHeight})`)
                .selectAll('text')
                .attr('transform', 'translate(-10,10)rotate(-90)')
                .style('text-anchor', 'end')
                .style('font-size', 12)
                .style('fill', 'white');


chartGroup2.append('g').call(yAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .style('font-size', 12)
            .style('fill', 'white');

// create svg rectangle per piece of data
chartGroup2.selectAll('rect')
    .data(stateSummary2)
    .enter()
    .append('rect')
    .attr('fill', 'lightblue')
    // .attr('opacity', '.75')
    .attr('x', d => xScale(d.key))
    .attr('y', d => yScale(d.value.avgBiden))
    .attr('width', xScale.bandwidth())
    .attr('height', d => chartHeight - yScale(d.value.avgBiden))
    .on('mouseover', function (){
        tooltip.style('display', null);
    })
    .on('mouseout', function() {
        tooltip.style('display', 'none');
    })
    .on('mousemove', function (d) {
        var xPos = d3.mouse(this)[0] - 75;
        var yPos = d3.mouse(this)[1] - 50; 
        tooltip.attr('transform', 'translate(' + xPos + ',' + yPos + ')');
        tooltip.select('text').text(d.key + ':' + d.value.avgBiden + '%');


});      

// Y axis label:
chartGroup2.append("text")
.attr("text-anchor", "end")
.attr("transform", "rotate(-90)")
.attr("y", -chartMargin.left+20)
.attr("x", -chartMargin.top-100)
.text("Vote Share (%)")
.attr('fill', 'white');

// Add chart title:
chartGroup2.append("text")
        .attr("x", (chartWidth / 2))             
        .attr("y", 0 - (chartMargin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .style('font-weight', 'bold')  
        .attr('fill', 'white')
        .text("Forecasted popular vote share by state - Biden");

const tooltip = chartGroup2.append('g')
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
popularVote2();

