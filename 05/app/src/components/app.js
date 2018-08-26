import * as d3 from "d3";
import React from "react";

class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      flag: true
    };
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

  componentDidUpdate () {
    this.updateVisual(this.state.flag ? this.dataA : this.dataB);
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

    // X Label
    this.g.append("text")
      .attr("y", this.height + 50)
      .attr("x", this.width / 2)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Month");

    // Y Label
    this.yLabel = this.g.append("text")
      .attr("y", -60)
      .attr("x", - (this.height / 2))
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Revenue");
  }

  renderData () {
    const { g, margin, width, height } = this;

    d3.json("http://localhost:8080/data/revenues.json").then(data => {
      this.dataA = data;
      this.dataB = [...data].slice(1);

      // Clean data
      data.forEach(function(d) {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
      });

      d3.interval(() => {
        this.toggleFlag();
      }, 1000);
      this.updateVisual(data);
    });
  }

  toggleFlag = () => {
    this.setState({
      flag: !this.state.flag
    });
  }

  updateVisual = data => {
    const { g, height, x, xAxisGroup, y, yAxisGroup } = this;
    const value = this.state.flag ? "revenue" : "profit";

    x.domain(data.map(d => d.month));
    y.domain([0, d3.max(data, d => d[value])]);

    // transition variable
    const t = d3.transition().duration(750);

    // X Axis
    const xAxisCall = d3.axisBottom(x);
    xAxisGroup.transition(t).call(xAxisCall);

    // Y Axis
    const yAxisCall = d3.axisLeft(y)
      .tickFormat(d => "$" + d);
    yAxisGroup.transition(t).call(yAxisCall);

    // Bars (d3 update pattern)
    // JOIN new data with old elements
    const rects = g.selectAll("rect")
      .data(data, d => d.month);

    // EXIT old elements not present in new data
    rects.exit()
        .attr("fill", "red")
      .transition(t)
        .attr("y", y(0))
        .attr("height", 0)
      .remove();

    // UPDATE old elements present in new data
    // rects.transition(t)
    //   .attr("y", function(d){ return y(d[value]); })
    //   .attr("x", function(d){ return x(d.month) })
    //   .attr("height", function(d){ return height - y(d[value]); })
    //   .attr("width", x.bandwidth);

    // ENTER new elements present in new data
    rects.enter()
      .append("rect")
        .attr("x", function(d){ return x(d.month) })
        .attr("width", x.bandwidth)
        .attr("fill", "grey")
        .attr("y", y(0))
        .attr("height", 0)
        // And UPDATE old elements present in data at the same time
      .merge(rects)
      .transition(d3.transition)
        .attr("y", function(d){ return y(d[value]); })
        .attr("height", function(d){ return height - y(d[value]); })
        .attr("x", d => x(d.month))
        .attr("width", x.bandwidth);

    this.yLabel.text(value[0].toUpperCase() + value.substr(1));
  }
}

export default App;
