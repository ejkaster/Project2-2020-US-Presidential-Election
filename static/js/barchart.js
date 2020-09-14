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

//####################### CHART 1 - POPULAR (TRUMP) #######################################
// Select div-id=bar-popular, append SVG area to it, and set the dimensions
const svg1 = d3.select("#bar-popular")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
const chartGroup1 = svg1.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
 
// Load data from project2_ MongoDB
const dataUrl1 = '/api/v1.0/states';

const electionData1 = d3.json(dataUrl1).then(electionData1 => {
              console.log(electionData1[0]);
              console.log(electionData1.length);

//  Min, Max for both candidates
const voterangeTrump = d3.extent(electionData1, function(d) { return d.voteshare_inc; });
              console.log(`Trump - min and max:  ${voterangeTrump}`);

const voterangeBiden = d3.extent(electionData1, function(d) { return d.voteshare_chal; });
              console.log(`Biden - min and max:  ${voterangeBiden}`);

//  Avg for both candidates as of 9/4/2020 nationwide
const avgTrump = d3.mean(electionData1, function(d) { return d.voteshare_inc; });
console.log(`Trump - avg:  ${avgTrump}`);

const avgBiden = d3.mean(electionData1, function(d) { return d.voteshare_chal; });
console.log(`Biden - avg:  ${avgBiden}`);


const summaryData = electionData1.map(function(d,i) {

  return {
    date: d.modeldate,
    state: d.state,
    index: i + 1,
    incVotes: +Math.round(d.voteshare_inc),
    chalVotes: +Math.round(d.voteshare_chal)
  };
});
console.log(summaryData[0]);

// Group by state and % average by state for each candidate
const stateMetrics = d3.nest()
  .key(function(d) { return d.state; })
  .rollup(function(v) { return {
    avgTrump: +d3.mean(v, function(d) { return d.incVotes; }),
    avgBiden: +d3.mean(v, function(d) { return d.chalVotes; })
  }; 
})
  .entries(summaryData);
// console.log(stateMetrics);
 
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


// Create scales
// x scale
let xScale = d3.scaleBand()
              .domain(stateSummary.map(row=>row.key))
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
chartGroup1.append('g')
            .call(xAxis)
            .attr('transform', `translate(0, ${chartHeight})`)
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
    .attr('opacity', '.75')
    .attr('x', d => xScale(d.key))
    .attr('y', d => yScale(d.value.avgTrump))
    .attr('width', xScale.bandwidth())
    .attr('height', d => chartHeight - yScale(d.value.avgTrump))
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
.attr("y", -chartMargin.left+20)
.attr("x", -chartMargin.top-100)
.text("Vote Share (%)")
.attr('fill', 'white');

// Add chart title:
chartGroup1.append("text")
        .attr("x", (chartWidth / 2))             
        .attr("y", 0 - (chartMargin.top / 2))
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


});


//############################ CHART 2 - POPULAR (BIDEN) #####################################
// Select div-id=bar-popular, append SVG area to it, and set the dimensions
const svg2 = d3.select("#bar-popular")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
const chartGroup2 = svg2.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
 
// Load data from project2_ MongoDB
const dataUrl2 = '/api/v1.0/states';

const electionData2 = d3.json(dataUrl2).then(electionData2 => {
              console.log(electionData2[0]);
              console.log(electionData2.length);

const summaryData2 = electionData2.map(function(d,i) {

  return {
    date: d.modeldate,
    state: d.state,
    index: i + 1,
    incVotes: +Math.round(d.voteshare_inc),
    chalVotes: +Math.round(d.voteshare_chal)
  };
});
console.log(summaryData2[0]);

// Group by state and % average by state for each candidate
const stateMetrics2 = d3.nest()
  .key(function(d) { return d.state; })
  .rollup(function(v) { return {
    avgTrump: +d3.mean(v, function(d) { return d.incVotes; }),
    avgBiden: +d3.mean(v, function(d) { return d.chalVotes; })
  }; 
})
  .entries(summaryData2);
// console.log(stateMetrics2);
 
let j = 24
cleanedStateData4 = stateMetrics2.slice(0, j).concat(stateMetrics2.slice(j + 1, stateMetrics2.length))
// console.log(cleanedStateData4); 

j = 24
cleanedStateData5 = cleanedStateData4.slice(0, j).concat(cleanedStateData4.slice(j + 1, cleanedStateData4.length))
// console.log(cleanedStateData5); 

j = 24
cleanedStateData6 = cleanedStateData5.slice(0, j).concat(cleanedStateData5.slice(j + 1, cleanedStateData5.length))
// console.log(cleanedStateData6); 

j = 32
cleanedStateData7 = cleanedStateData6.slice(0, j).concat(cleanedStateData6.slice(j + 1, cleanedStateData6.length))
// console.log(cleanedStateData7); 

j = 32
stateSummary2 = cleanedStateData7.slice(0, j).concat(cleanedStateData7.slice(j + 1, cleanedStateData7.length))
console.log(stateSummary2.reverse()); 


// Create scales
// x scale
let xScale2 = d3.scaleBand()
              .domain(stateSummary2.map(row=>row.key))
              .range([0, chartWidth])
              .paddingInner(0.5);

// y scale
let yScale2 = d3.scaleLinear()
              .domain([0, 100])
              .range([chartHeight, 0]);

// create and customize axes
let xAxis2 = d3.axisBottom(xScale2);

let yAxis2 = d3.axisLeft(yScale2).ticks(10);

// render axes with .call
chartGroup2.append('g')
            .call(xAxis2)
            .attr('transform', `translate(0, ${chartHeight})`)
                .selectAll('text')
                .attr('transform', 'translate(-10,10)rotate(-90)')
                .style('text-anchor', 'end')
                .style('font-size', 12)
                .style('fill', 'white');
                

chartGroup2.append('g').call(yAxis2)
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
    .attr('opacity', '.75')
    .attr('x', d => xScale2(d.key))
    .attr('y', d => yScale2(d.value.avgBiden))
    .attr('width', xScale2.bandwidth())
    .attr('height', d => chartHeight - yScale2(d.value.avgBiden))
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

// Add chart label:
chartGroup2.append("text")
        .attr("x", (chartWidth / 2))             
        .attr("y", 0 - (chartMargin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .style('font-weight', 'bold')
        .attr('fill', 'white')
        .text("Forecasted popular vote share by state - Biden");

    

    var tooltip = chartGroup2.append('g')
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



});

//####################### CHART 1 - ELECTORAL VOTES (TRUMP) #######################################
const svg3 = d3.select("#bar-electoral")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
const chartGroup3 = svg3.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
 
// Load data from project2_ MongoDB
const dataUrl3 = '/api/v1.0/national';

const electionData3 = d3.json(dataUrl3).then(electionData3 => {
              console.log(electionData3[0]);
              console.log(electionData3.length);

const summaryData3 = electionData3.map(function(d,i) {

  return {
    date: d.modeldate,
    ev_inc: +Math.round(d.ev_inc),
    ev_chal: +Math.round(d.ev_chal)
  };
});
console.log(summaryData3[0]);

// Filter for last month of data
const lastWeek = summaryData3.filter(function(d) { return d.date > '8/1/20'; });
console.log(lastWeek);


// // Create scales
// x scale
let xScale3 = d3.scaleBand()
              .domain(lastWeek.map(row=>row.date))
              .range([0, chartWidth])
              .paddingInner(.5);

// y scale
let yScale3 = d3.scaleLinear()
              .domain([0, 325])
              .range([chartHeight, 0]);

// // create and customize axes
let xAxis3 = d3.axisBottom(xScale3);
let yAxis3 = d3.axisLeft(yScale3).ticks(10);


// // render axes with .call
chartGroup3.append('g')
            .call(xAxis3)
            .attr('transform', `translate(0, ${chartHeight})`)
                .selectAll('text')
                .attr('transform', 'translate(-10,10)rotate(-90)')
                .style('text-anchor', 'end')
                .style('font-size', 12)
                .style('fill', 'white');
                

chartGroup3.append('g').call(yAxis3)
            .selectAll('text')
            .style('text-anchor', 'end')
            .style('font-size', 12)
            .style('fill', 'white');

// // create svg rectangle per piece of data
chartGroup3.selectAll('rect')
    .data(lastWeek)
    .enter()
    .append('rect')
    .attr('fill', 'red')
    .attr('opacity', '.75')
    .attr('x', d => xScale3(d.date))
    .attr('y', d => yScale3(d.ev_inc))
    .attr('width', xScale3.bandwidth())
    .attr('height', d => chartHeight - yScale3(d.ev_inc))
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
        tooltip.select('text').text(d.date + ':' + d.ev_inc + '' + 'votes');

     });      
      
      
// // Y axis label:
chartGroup3.append("text")
.attr("text-anchor", "end")
.attr("transform", "rotate(-90)")
.attr("y", -chartMargin.left+10)
.attr("x", -chartMargin.top-100)
.text("Vote Count")
.attr('fill', 'white');

// // Add chart title:
chartGroup3.append("text")
        .attr("x", (chartWidth / 2))             
        .attr("y", 0 - (chartMargin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .style('font-weight', 'bold')  
        .attr('fill', 'white')
        .text("Forecasted electoral vote count - Trump");

    

const tooltip = chartGroup3.append('g')
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


});


// //############################ CHART 2 - ELECTORAL VOTES (BIDEN) #####################################
const svg4 = d3.select("#bar-electoral")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
const chartGroup4 = svg4.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
 
// // Load data from project2_ MongoDB
const dataUrl4 = '/api/v1.0/national';

const electionData4 = d3.json(dataUrl4).then(electionData4 => {
              console.log(electionData4[0]);
              console.log(electionData4.length);

const summaryData4 = electionData4.map(function(d,i) {

  return {
    date: d.modeldate,
    ev_inc: +Math.round(d.ev_inc),
    ev_chal: +Math.round(d.ev_chal)
  };
});
console.log(summaryData4[0]);

// // Filter for last month of data
const lastWeek2 = summaryData4.filter(function(d) { return d.date > '8/1/20'; });
console.log(lastWeek2);


// // Create scales
// // x scale
let xScale4 = d3.scaleBand()
              .domain(lastWeek2.map(row=>row.date))
              .range([0, chartWidth])
              .paddingInner(.5);

// // y scale
let yScale4 = d3.scaleLinear()
              .domain([0, 325])
              .range([chartHeight, 0]);

// // create and customize axes
let xAxis4 = d3.axisBottom(xScale4);

let yAxis4 = d3.axisLeft(yScale4).ticks(10);


// // render axes with .call
chartGroup4.append('g')
            .call(xAxis4)
            .attr('transform', `translate(0, ${chartHeight})`)
                .selectAll('text')
                .attr('transform', 'translate(-10,10)rotate(-90)')
                .style('text-anchor', 'end')
                .style('font-size', 12)
                .style('fill', 'white');
                

chartGroup4.append('g').call(yAxis4)
            .selectAll('text')
            .style('text-anchor', 'end')
            .style('font-size', 12)
            .style('fill', 'white');

// // create svg rectangle per piece of data
chartGroup4.selectAll('rect')
    .data(lastWeek2)
    .enter()
    .append('rect')
    .attr('fill', 'lightblue')
    .attr('opacity', '.75')
    .attr('x', d => xScale4(d.date))
    .attr('y', d => yScale4(d.ev_chal))
    .attr('width', xScale4.bandwidth())
    .attr('height', d => chartHeight - yScale4(d.ev_chal))
    .on('mouseover', function (){
        tooltip1.style('display', null);
    })
    .on('mouseout', function() {
        tooltip1.style('display', 'none');
    })
    .on('mousemove', function (d) {
        var xPos1 = d3.mouse(this)[0] - 75;
        var yPos1 = d3.mouse(this)[1] - 50; 
        tooltip1.attr('transform', 'translate(' + xPos1 + ',' + yPos1 + ')');
        tooltip1.select('text').text(d.date + ':' + d.ev_chal + ''+ 'votes');


      });      
      
      
// // Y axis label:
chartGroup4.append("text")
.attr("text-anchor", "end")
.attr("transform", "rotate(-90)")
.attr("y", -chartMargin.left+10)
.attr("x", -chartMargin.top-100)
.text("Vote Count")
.attr('fill', 'white');

// // Add chart title:
chartGroup4.append("text")
        .attr("x", (chartWidth / 2))             
        .attr("y", 0 - (chartMargin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .style('font-weight', 'bold')  
        .attr('fill', 'white')
        .text("Forecasted electoral vote count - Biden");

    

const tooltip1 = chartGroup4.append('g')
        .style('display', 'none')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '2px')
        .style('border-radius', '5px')
        .style('padding', '5px');

        tooltip1.append('text')
            .attr('x', 15)
            .attr('dy', '1.2em')
            .style('font-size', '13')
            .style('fill', 'white')
            .attr('font-weight', 'bold');


});