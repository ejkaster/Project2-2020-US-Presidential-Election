const table = async () => {
    //here is the code for my barchart
    const timelineData = await (await fetch('/api/v1.0/table')).json();
    console.log(timelineData.reverse());

const sorted_timelineData  =  timelineData.map(({ _id, ...item }) => item);
    console.log(sorted_timelineData);


// Select element where to display data:
var tbody = d3.select("tbody");

// // Display original data in 'tbody' section, and use function to display filtered results
function displayData(sorted_timelineData){ 
  sorted_timelineData.forEach(function(count){
    new_tr = tbody.append("tr")
      Object.entries(count).forEach(function([key, value]){
        new_td = new_tr.append("td").text(value)	
  });
})
};

displayData(sorted_timelineData);

// // Clear the existing output
function clearBody() {
  d3.select("tbody")
    .selectAll("tr").remove()
    .selectAll("td").remove();
};

// // Select 'Filter Table' button on 'click' and 'Form' on 'submit' to handle changes
var filterButton = d3.select("#filter-btn");
var form = d3.selectAll("form");

// Select search field element
var searchElem = d3.select("#datetime");

// Create function to filter the data on user input and display results
function handleChange(event) {
  // avoid refreshing page
  d3.event.preventDefault();
  // call 'Clear' function to clear existing output
  clearBody();

// @Get the 'value' property of the search field element
  var inputValue = searchElem.property("value");
// Print the value to the console 
  console.log(inputValue);
  
// // Create condition to return results
  if (searchElem.property('value') === "" ) {
    // display original data if search field empty
    var results = sorted_timelineData;
  } else {
    // otherwise, display the filtered results  
    var results = sorted_timelineData.filter(stateSearch => 
      stateSearch.state === searchElem.property('value'));
  };

  console.log(results);
  displayData(results);
};


// // Create event handlers
filterButton.on("click", handleChange);
form.on("submit", handleChange);

}
table();