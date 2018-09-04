import * as d3 from "d3";
import React from "react";

import Nav from "./nav";
import "../styles/main.css";

class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {};
  }

  render () {
    return (
      <div>
        <Nav />
        <div id="chart-area">
        </div>
      </div>
    );
  }

  addDataToVisual = () => {
    const {
      bisectDate, data, g, height, line, parseTime, width, x, xAxis,
      xAxisCall, y, yAxis, yAxisCall
    } = this;

    // Data cleaning
    data.forEach(function(d) {
      d.year = parseTime(d.year);
      d.value = +d.value;
    });

    // Set scale domains
    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([d3.min(data, function(d) { return d.value; }) / 1.005, 
        d3.max(data, function(d) { return d.value; }) * 1.005]);

    // Generate axes once scales have been set
    xAxis.call(xAxisCall.scale(x))
    yAxis.call(yAxisCall.scale(y))

    // Add line to chart
    g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", "3px")
        .attr("d", line(data));

    // /******************************** Tooltip Code ********************************/

    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", width);

    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

    g.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.year > d1.year - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
        focus.select("text").text(d.value);
        focus.select(".x-hover-line").attr("y2", height - y(d.value));
        focus.select(".y-hover-line").attr("x2", -x(d.year));
    }
  };

  componentDidMount () {
    this.initVisual();
    this.fetchAndVisualizeData();
  }

  fetchAndVisualizeData = () => {
    d3.json("http://localhost:8080/data/example.json").then(data => {
      this.data = data;

      this.addDataToVisual();
    });
  };

  initVisual = () => {
    const margin = { left:80, right:100, top:50, bottom:100 },
      height = 500 - margin.top - margin.bottom, 
      width = 800 - margin.left - margin.right;
    const svg = d3.select("#chart-area").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", "translate(" + margin.left + 
          ", " + margin.top + ")");

    // Time parser for x-scale
    const parseTime = d3.timeParse("%Y");
    // For tooltip
    const bisectDate = d3.bisector(function(d) { return d.year; }).left;

    // Scales
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Axis generators
    const xAxisCall = d3.axisBottom();
    const yAxisCall = d3.axisLeft()
      .ticks(6)
      .tickFormat(function(d) { return parseInt(d / 1000) + "k"; });

    // Axis groups
    const xAxis = g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");
    const yAxis = g.append("g")
      .attr("class", "y axis");
        
    // Y-Axis label
    yAxis.append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .attr("fill", "#5D6971")
      .text("Population)");

    // Line path generator
    const line = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.value); })

    // bind to this for use in other functions
    const that = {
      bisectDate, g, height, line, parseTime, width, x, xAxis,
      xAxisCall, y, yAxis, yAxisCall
    };
    for (let k in that) {
      this[k] = that[k];
    }
  };
}

export default App;
