function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(sampleData) {
    console.log(sampleData);

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(sampleData).forEach(([key, value]) => {
      PANEL.append('h6').text(`${key}, ${value}`);
    })

  })
}


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // Fetch the JSON data and console log it

  d3.json(`/samples/${sample}`).then(function (sampleData) {
    console.log(sampleData);

    const otu_ids = sampleData.otu_ids;
    const otu_labels = sampleData.otu_labels;
    const sample_values = sampleData.sample_values;

    console.log(sampleData.otu_ids);
    
  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).

    var pieChartData = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10,),
      hoverinfo: "hovertext",
      type: "pie"
    }];

    var pieLayout = {
      margin: {t: 0, l: 0}
    }

  // Plot the Pie Chart
    Plotly.plot("pie", pieChartData, pieLayout);



  // @TODO: Build a Bubble Chart using the sample data

  var bubbleChartData = [{
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      size: sample_values,
      color: otu_ids,
    }
  }];


  var bubbleLayout = {
    xaxis: {title: 'OTU ID'},
    title: "Belly Button Samples Bubble Chart",
    margin: {t: 0},
    hovermode: "closest"
  }


    // Plot the Bubble Chart
    Plotly.plot("bubble", bubbleChartData, bubbleLayout);

  });

}

function init() {

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("names").then((sampleNames) => {
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
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
