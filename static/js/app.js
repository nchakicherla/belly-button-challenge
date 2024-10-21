const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Build the metadata panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];


    //result.otu_ids.map(id => Number(id));  // Ensure OTU IDs are numbers

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let sample_values = result.sample_values.slice(0, 10).reverse();
    let otu_labels = result.otu_labels.slice(0, 10).reverse();

    // Build a Bubble Chart
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"      }
    }];

    let bubbleLayout = {
      title: "OTUs in the Sample",
      margin: { t: 30 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };
    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let barData = [{
          x: sample_values,
          y: otu_ids,
          text: otu_labels,
          type: "bar",
          orientation: "h"
        }];

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json(url).then((data) => {
    // Get the names field
    names = data.names

    // Use d3 to select the dropdown with id of `#selDataset`
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      selector
        .append("option")
        .text(name)
        .property("value", name);
    });

    // Get the first sample from the list
    let firstSample = data.names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

    //console.log(data.otu_ids);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
