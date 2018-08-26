import * as d3 from "d3";
import React from "react";

class App extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div id="svgTarget">
      </div>
    );
  }

  componentDidMount () {
    this.initVisual();
    this.renderData();
  }

  initVisual () {
    this.margin = { left:80, right:20, top:50, bottom:100 };

    this.width = 600 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.x = d3.scaleBand()
      .range([0, this.width])
      .padding(0.2);

    this.y = d3.scaleLinear()
      .range([this.height, 0]);

    this.g = d3.select("#svgTarget")
      .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
          .attr("transform", "translate(" + this.margin.left + ", " + this.margin.top + ")");

    this.xAxisGroup = this.g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height +")");

    this.yAxisGroup = this.g.append("g")
      .attr("class", "y axis");
  }

  renderData () {
    const { g, margin, width, height } = this;

    // X Label
    g.append("text")
      .attr("y", height + 50)
      .attr("x", width / 2)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Month");

    // Y Label
    g.append("text")
      .attr("y", -60)
      .attr("x", -(height / 2))
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Revenue");

    d3.json("http://localhost:8080/data/revenues.json").then( data => {
      // console.log(data);

      // Clean data
      data.forEach(function(d) {
        d.revenue = +d.revenue;
      });

      d3.interval(() => {
        this.updateVisual(data);
      }, 1000);
      this.updateVisual(data);
    });
  }

  updateVisual = data => {
    const { g, height, x, xAxisGroup, y, yAxisGroup } = this;

    x.domain(data.map(d => d.month));
    y.domain([0, d3.max(data, d => d.revenue )]);

    // X Axis
    const xAxisCall = d3.axisBottom(x);
    xAxisGroup.call(xAxisCall);

    // Y Axis
    const yAxisCall = d3.axisLeft(y)
      .tickFormat(d => "$" + d);
    yAxisGroup.call(yAxisCall);

    // // Bars
    // const rects = g.selectAll("rect")
    //   .data(data)
    //
    // rects.enter()
    //   .append("rect")
    //     .attr("y", function(d){ return y(d.revenue); })
    //     .attr("x", function(d){ return x(d.month) })
    //     .attr("height", function(d){ return height - y(d.revenue); })
    //     .attr("width", x.bandwidth)
    //     .attr("fill", "grey");
  }
}

export default App;
