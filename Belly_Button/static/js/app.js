function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`
  d3.json(url).then(function(sampleData){
    // Use d3 to select the panel with id of `#sample-metadata`
    console.log(sampleData);
    
    var metaData = d3.select("#sample-metadata")
    // Use `.html("") to clear any existing metadata
    metaData.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampleData).forEach(function ([key, value]) {
      var row = metaData.append("h6");
      row.text(`${key}: ${value}`);
      });
    });
  }

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {
// @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`
  d3.json(url).then(function(sampleData){
    console.log(sampleData);
    
// @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: 'markers',
      marker: {
          size: sampleData.sample_values,
          color: sampleData.otu_ids,
          colorscale: "Earth",
      }
    };
    var bubbleData = [trace1]
    console.log(bubbleData)
  
    var bubbleLayout = {
    margin: { t: 0 },
    hovermode: 'closest',
    xaxis: { title: 'OTU ID' }
  };
    Plotly.plot("bubble", bubbleData, bubbleLayout);

// @TODO: Build a Pie Chart
// HINT: You will need to use slice() to grab the top 10 sample_values,
// otu_ids, and labels (10 each).
   
    // const sort_data = sampleData.sample_values.sort(function(a, b){return b-a})

    var pieData = [{
      labels: sampleData.otu_ids.slice(0,10),
      values: sampleData.sample_values.slice(0,10),
      hovertext: sampleData.otu_labels.slice(0,10),
      hoverinfo: 'hovertext',
      type: 'pie'
    }];

    var pieLayout = {
      margin: { t: 0, l: 0 }
  };

    Plotly.plot("pie", pieData, pieLayout);
 });
}

function updateCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = `/samples/${sample}`
    d3.json(url).then(function(sampleData){
      console.log(sampleData);
      
  // @TODO: Build a Bubble Chart using the sample data
    Plotly.restyle("bubble", 'x', [sampleData.otu_ids]);
    Plotly.restyle("bubble", 'y', [sampleData.sample_values]);
    Plotly.restyle("bubble", 'text', [sampleData.otu_labels]);
    Plotly.restyle("bubble", 'marker.size', [sampleData.sample_values]);
    Plotly.restyle("bubble", 'marker.color', [sampleData.otu_ids]);
  
  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
     
      // const sort_data = sampleData.sample_values.sort(function(a, b){return b-a})
  
      var pieData = {
        labels: [sampleData.otu_ids.slice(0,10)],
        values: [sampleData.sample_values.slice(0,10)],
        hovertext: [sampleData.otu_labels.slice(0,10)],
        hoverinfo: 'hovertext',
        type: 'pie'
      };
  
      Plotly.restyle("pie", pieData);
   });
  }

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  updateCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
