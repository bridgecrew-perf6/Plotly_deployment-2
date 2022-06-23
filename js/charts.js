function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    console.log(samples[0]);
    var resultArray = samples.filter(sampleObj => parseInt(sampleObj.id) == sample);
    console.log(resultArray);
    console.log(sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    let sample_object_array = [];
    for (let i = 0; i < otu_ids.length; i++) {
      sample_object_array.push({
        otu_id: otu_ids[i],
        otu_label: otu_labels[i],
        sample_value: sample_values[i]
      });
    }

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    console.log(sample_object_array);
    let sorted_samples = sample_object_array.sort((a,b) => a.sample_value - b.sample_value).reverse().slice(0,10);
    sorted_samples = sorted_samples.reverse();
    console.log(sorted_samples);
    var yticks = sorted_samples.map(s => "OTU " + s.otu_id);

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: sorted_samples.map(s => s.sample_value), 
        y: yticks,
        type: "bar",
        orientation: "h",
        text: sorted_samples.map(s => s.otu_label),
      }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 11. Create the trace for the bubble chart.
    var trace1 = { 
      x: sorted_samples.map(s => s.otu_id),
      y: sorted_samples.map(s => s.sample_value),
      mode: 'markers',
      marker: {
        size: sorted_samples.map(s => s.sample_value),
        color: sorted_samples.map(s => s.otu_id)
      },
      text: sorted_samples.map(s => s.otu_label)
    }
    var bubbleData = [trace1];

    // 12. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {title: "OTU ID" },
      showlegend: false,
      height: 600,
      width: 600
    };   

    // 13. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

  });
}
