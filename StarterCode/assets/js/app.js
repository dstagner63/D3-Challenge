// Set up the SVG
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 130,
  left: 130
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read in "data.csv".
d3.csv("assets/data/data.csv").then(function(healthData) {
    console.log('response: ', healthData)

    // Step 1: Parse Data/Cast as numbers
    healthData.forEach(function(data) {
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        // data.state = data.state
});

    // Step 2: Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.income)-1000, d3.max(healthData, d => d.income)+1000])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.healthcare)-1, d3.max(healthData, d => d.healthcare)+1])
      .range([height, 0]);

    // Step 3: Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .attr("id", "xaxis")
      .call(bottomAxis);

    chartGroup.append("g")
      .attr("id", "yaxis")
      .call(leftAxis);

    // Step 5: Create Circles
    var dataGroup = chartGroup.selectAll("g")
    .data(healthData)
    .enter()
    .append("g")
    .attr("transform", function(d){
      return "translate(" + xLinearScale(d.income) + "," + yLinearScale(d.healthcare) + ")";
    });

    var circlesGroup = dataGroup.append("circle")
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5");

    var textGroup = dataGroup
      .append("text")
      .text(function(d){
        console.log(d);
        return d.abbr;
      })
      .attr("dx", -10)
      .attr("dy", 7)
    
      console.log(d3.selectAll("text"))

    // Step 6: Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Healthcare: ${d.healthcare}<br>Income: ${d.income}`);
      });

    // Step 7: Create tooltip in the chart
    chartGroup.call(toolTip);

    textGroup.on("mouseenter", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

   

    // Step 8: Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseenter", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
  
      
      var ageActive = 0 
      var incomeActive = 1
      var healthActive = 1
      var obesityActive = 0
      var smokesActive = 0
      var povertyActive = 0
      const updateXaxis = (attribute, offset) => {
      var label = attribute.charAt(0).toUpperCase() + attribute.slice(1);
      xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[attribute])-offset, d3.max(healthData, d => d[attribute])+offset])
      .range([0, width]);
      bottomAxis = d3.axisBottom(xLinearScale);
      d3.select("#xaxis").transition().duration(1000).call(bottomAxis);
      if (healthActive===1) {
        dataGroup
        .transition()
        .duration(1000)
        .on("start", function(){
          circlesGroup.attr("fill", "black")
          .attr("r", "5")
        })
        .attr("transform", function(d){
          return "translate(" + xLinearScale(d[attribute]) + "," + yLinearScale(d.healthcare) + ")";
        })
        .transition()
        .duration(1000)
        .on("start", function(){
          circlesGroup.attr("fill", "pink")
          .attr("r", "15")
        })
        toolTip.html(function(d) {
          return (`${d.state}<br>Healthcare: ${d.healthcare}<br>${label}: ${d[attribute]}`);
        });
      } else if (obesityActive===1){
        dataGroup
        .transition()
        .duration(1000)
        .on("start", function(){
          circlesGroup.attr("fill", "black")
          .attr("r", "5")
        })
        .attr("transform", function(d){
          return "translate(" + xLinearScale(d[attribute]) + "," + yLinearScale(d.obesity) + ")";
        })
        .transition()
        .duration(1000)
        .on("start", function(){
          circlesGroup.attr("fill", "pink")
          .attr("r", "15")
        });
        toolTip.html(function(d) {
              return (`${d.state}<br>Obesity: ${d.obesity}<br>${label}: ${d[attribute]}`);
        });
      } else if (smokesActive===1){
        dataGroup
        .transition()
        .duration(1000)
        .on("start", function(){
          circlesGroup.attr("fill", "black")
          .attr("r", "5")
        })
        .attr("transform", function(d){
          return "translate(" + xLinearScale(d[attribute]) + "," + yLinearScale(d.smokes) + ")";
        })
        .transition()
        .duration(1000)
        .on("start", function(){
          circlesGroup.attr("fill", "pink")
          .attr("r", "15")
        });
        toolTip.html(function(d) {
              return (`${d.state}<br>Smokes: ${d.smokes}<br>${label}: ${d[attribute]}`);
        });
      } 
      chartGroup.call(toolTip);
      }

      const updateYaxis = (attribute, offset) => {
      var label = attribute.charAt(0).toUpperCase() + attribute.slice(1);
      yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[attribute])-offset, d3.max(healthData, d => d[attribute])+ offset])
      .range([height, 0]);
      leftAxis = d3.axisLeft(yLinearScale);
      d3.select("#yaxis").transition().duration(1000).call(leftAxis);
      if (ageActive===1) {
        dataGroup
        .transition()
        .duration(1000)
        .on("start", function(){
          circlesGroup.attr("fill", "black")
          .attr("r", "5")
        })
        .attr("transform", function(d){
          return "translate(" + xLinearScale(d.age) + "," + yLinearScale(d[attribute]) + ")";
        })
        .transition()
        .duration(1000)
        .on("start", function(){
          circlesGroup.attr("fill", "pink")
          .attr("r", "15")
        })
        toolTip.html(function(d) {
          return (`${d.state}<br>Age: ${d.age}<br>${label}: ${d[attribute]}`);
        });
      } else if (incomeActive===1){
        dataGroup
        .transition()
        .duration(1000)
        .on("start", function(){
          circlesGroup.attr("fill", "black")
          .attr("r", "5")
        })
        .attr("transform", function(d){
          return "translate(" + xLinearScale(d.income) + "," + yLinearScale(d[attribute]) + ")";
        })
        .transition()
        .duration(1000)
        .on("start", function(){
          circlesGroup.attr("fill", "pink")
          .attr("r", "15")
        })
        toolTip.html(function(d) {
              return (`${d.state}<br>Income: ${d.income}<br>${label}: ${d[attribute]}`);
        });
      } else if (povertyActive===1){
        dataGroup
        .transition()
        .duration(1000)
        .on("start", function(){
          circlesGroup.attr("fill", "black")
          .attr("r", "5")
        })
        .attr("transform", function(d){
          return "translate(" + xLinearScale(d.poverty) + "," + yLinearScale(d[attribute]) + ")";
        })
        .transition()
        .duration(1000)
        .on("start", function(){
          circlesGroup.attr("fill", "pink")
          .attr("r", "15")
        })
        toolTip.html(function(d) {
              return (`${d.state}<br>Poverty: ${d.poverty}<br>${label}: ${d[attribute]}`);
        });
      }
      chartGroup.call(toolTip);
      }

      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("stroke", "black")
        .text("Lacks Healthcare (%)")
        .on("click", function(d){
          healthActive = 1;
          obesityActive = 0;
          smokesActive = 0;
          updateYaxis("healthcare", 1)
        })

        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 30)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("stroke", "black")
        .text("Obesity (%)")
        .on("click", function(d){
          obesityActive = 1;
          healthActive = 0;
          smokesActive = 0;
          updateYaxis("obesity", 1)
        })
  
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 60)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("stroke", "black")
        .text("Smokes (%)")
        .on("click", function(d){
          obesityActive = 0;
          healthActive = 0;
          smokesActive = 1;
          updateYaxis("smokes", 1)
        })

      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .attr("stroke", "black")
        .text("Age (yr)")
        .on("click", function(){
          ageActive = 1;
          incomeActive = 0;
          povertyActive = 0;
          updateXaxis("age", 1)
        })

      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 60})`)
        .attr("class", "axisText")
        .attr("stroke", "black")
        .text("Income ($)")
        .on("click", function(){
          ageActive = 0;
          incomeActive = 1; 
          povertyActive = 0;
          updateXaxis("income", 1000)
        })

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 90})`)
        .attr("class", "axisText")
        .attr("stroke", "black")
        .text("Poverty (%)")
        .on("click", function(){
          ageActive = 0;
          incomeActive = 0; 
          povertyActive = 1;
          updateXaxis("poverty", 1)
        })

    }).catch(function(error) {
      console.log(error);
    });
  
