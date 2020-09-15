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
    // .attr('opacity', '.75')
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
    // .attr('opacity', '.75')
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

//############################ CHART 3 - ELECTORAL MULTI-BAR CHART  #####################################
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


// // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
const chartGroup3 = svg3.append("g")
  .attr("transform", `translate(${chartMargin3.left}, ${chartMargin3.top})`);
 
// Load data from project2_ MongoDB
const dataUrl3 = '/api/v1.0/national';

const electionData3 = d3.json(dataUrl3).then(electionData3 => {
              console.log(electionData3[0]);
              console.log(electionData3.length);

const summaryData3 = electionData3.map(function(d,i) {

  return {
    date: d.modeldate,
    Trump: +Math.round(d.ev_inc),
    Biden: +Math.round(d.ev_chal)
  };
});
console.log(summaryData3[0]);


// Filter for last month of data
const lastMonth = summaryData3.filter(function(d) { return d.date > '8/1/20'; });
console.log(lastMonth);

// Draw chart - sample 1

// List of subgroups - headers
var subgroups = d3.keys(lastMonth[0]).filter(function(d) {
  return d != "date";
});
console.log(subgroups);


// // // List of groups =  value of the first column called date -> I show them on the X axis
var groups = d3.map(lastMonth, function(d){return(d.date)}).keys()
console.log(groups);

// // // Add X axis
// The scale spacing the groups:
var x0 = d3.scaleBand()
    .rangeRound([0, chartWidth3])
    .paddingInner(0.085);

// The scale for spacing each group's bar:
var x1 = d3.scaleBand()
    .padding(0.08);

var y = d3.scaleLinear()
    .rangeRound([chartHeight3, 0]);

// color palette = one color per subgroup
var z = d3.scaleOrdinal()
    .range(["red", "lightblue"]);

    x0.domain(lastMonth.map(function(d) { return d.date; }));
    x1.domain(subgroups).rangeRound([0, x0.bandwidth()]);
    y.domain([0, 400]);

// //  // Show the bars
chartGroup3.append("g")
.selectAll("g")
.data(lastMonth)
.enter().append("g")
.attr("transform", function(d) { return "translate(" + x0(d.date) + ",0)"; })
.style('fill', 'white')
.selectAll("rect")
.data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
.enter().append("rect")
  .attr("x", function(d) { return x1(d.key); })
  .attr("y", function(d) { return y(d.value); })
  .attr("width", x1.bandwidth())
  .attr("height", function(d) { return chartHeight3 - y(d.value); })
  .attr("fill", function(d) { return z(d.key); });
  

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
.attr("y", -chartMargin3.left+20)
.attr("x", -chartMargin3.top-50)
.text("Electoral Vote Count")
.attr('fill', 'white');

// Add chart label:
chartGroup3.append("text")
        .attr("x", (chartWidth3 / 2))             
        .attr("y", 0 - (chartMargin3.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .attr('fill', 'white')
        .text("Forecasted Electoral Vote Count");

   
var legend = chartGroup3.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(subgroups.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 30 + ")"; });
      legend.append("rect")
      .attr("x", chartWidth3 - 15)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", z)
      .attr("stroke", z)
      .attr("stroke-width",2)
      .on("click",function(d) { update(d) });

  legend.append("text")
      .attr("x", chartWidth3 - 24)
      .attr("y", 12)
      .attr("dy", "0.32em")
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .text(function(d) { return d; });


// });


      var filtered = [];

  ////
  //// Update and transition on click:
  ////
  
  function update(d) {  
   
    //
    // Update the array to filter the chart by:
    //
   
    // add the clicked key if not included:
    if (filtered.indexOf(d) == -1) {
     filtered.push(d); 
      // if all bars are un-checked, reset:
      if(filtered.length == subgroups.length) filtered = [];
    }
    // otherwise remove it:
    else {
      filtered.splice(filtered.indexOf(d), 1);
    }
    
    //
    // Update the scales for each group(/dates)'s items:
    //
    var newKeys = [];
    subgroups.forEach(function(d) {
      if (filtered.indexOf(d) == -1 ) {
        newKeys.push(d);
      }
    })
    x1.domain(newKeys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(lastMonth, function(d) { return d3.max(subgroups, function(key) { if (filtered.indexOf(key) == -1) return d[key]; }); })]).nice();
    
    // update the y axis:
            chartGroup3.select(".y")
            .transition()
            .call(d3.axisLeft(y).ticks(null, "s"))
            .duration(500);
    
// Filter out the bands that need to be hidden:
    //
    var bars = chartGroup3.selectAll(".bar").selectAll("rect")
      .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    
   bars.filter(function(d) {
         return filtered.indexOf(d.key) > -1;
      })
      .transition()
      .attr("x", function(d) {
        return (+d3.select(this).attr("x")) + (+d3.select(this).attr("width"))/2;  
      })
      .attr("height",0)
      .attr("width",0)     
      .attr("y", function(d) { return chartHeight; })
      .duration(500);
            
    //
    // Adjust the remaining bars:
    //
    bars.filter(function(d) {
        return filtered.indexOf(d.key) == -1;
      })
      .transition()
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return chartHeight - y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("fill", function(d) { return z(d.key); })
      .duration(500);

 // update legend:
 legend.selectAll("rect")
 .transition()
 .attr("fill",function(d) {
   if (filtered.length) {
     if (filtered.indexOf(d) == -1) {
       return z(d); 
     }
      else {
       return "white"; 
     }
   }
   else {
    return z(d); 
   }
 })
 .duration(100);


}

});