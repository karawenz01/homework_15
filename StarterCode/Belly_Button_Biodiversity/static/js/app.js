function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url_meta = "/metadata/" + sample
  console.log(url_meta);

  d3.json(url_meta).then((sample_metadata) => {

    console.log(sample_metadata);

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    var metadata = Object.entries(sample_metadata);

    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    metadata.forEach((sample)=>{
      panel
      .append('li')
      .text(`${sample[0]}: ${sample[1]}`)
    })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    // https://plot.ly/javascript/gauge-charts/

    var level = sample_metadata.WFREQ * 20;
    var degrees = 180 - level, radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    
    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd); 
    
    var data = [{ type: 'scatter',
        x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'Scrubs per Week',
        hoverinfo: 'text+name'},
      { values: [2, 2, 2, 2, 2, 2, 2, 2, 2, 18],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                        'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                        'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                        'rgba(102, 185, 153, .3)', 'rgba(102, 185, 125, .5)', 
                        'rgba(75, 151, 146, .5)', 'rgba(255, 255, 255, 0)']},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];
    
    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: 'Number of visit for last 7 days',
      autosize: True,
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      },
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };
    
    Plotly.newPlot('gauge', data, layout);

  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url_chart = "/samples/" + sample
  console.log(url_chart)

  d3.json(url_chart).then((sample_data) => {
    console.log(sample_data); // **ERROR** returns undefined

    var response = sample_data;

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values, 
      mode: 'markers',
      marker: {
        color: response.otu_ids,
        size: response.sample_values
      },
      text: response.otu_labels
    };

    var data1 = [trace1];

    var layout1 = {
      title: 'Session duration Vs. Traffic',
      xaxis: {title: 'Traffic'},
      yaxis: {title: 'Session duration'}}
    
    Plotly.newPlot('bubble', data1, layout1);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var trace2 = {
      // Use sample_values as the values for the PIE chart
      values: response.sample_values.slice(0,10),
      // Use otu_ids as the labels for the pie chart
      labels: response.otu_ids.slice(0,10), 
      // Use otu_labels as the hovertext for the chart
      hovertext: response.otu_labels.slice(0,10),
      type: 'pie'
    };

    var data2 = [trace2];

    var layout2 = {
      title: 'Item ID searched by user'};

    Plotly.newPlot('pie', data2, layout2);
    
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
    
    console.log("Option should be listed!");

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);

    console.log("default sample is 940");
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();