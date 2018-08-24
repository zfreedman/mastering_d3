import * as d3 from "d3";
import React from "react";

class App extends React.Component {
  render () {
    return (
      <div id="svgTarget">
      </div>
    );
  }

  componentDidMount () {
    this.renderCircles();
  }

  renderCircles () {
    const margin = { bottom: 150, left: 100, right: 10, top: 10 };

    const groupHeight = 400 - margin.bottom - margin.top;
    const groupWidth = 600 - margin.left - margin.right;

    // canvas
    const svg = d3.select("#svgTarget")
      .append("svg")
        .attr("height", groupHeight + margin.bottom + margin.top)
        .attr("width", groupWidth + margin.left + margin.right);

    // svg group for bars
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // labels
    g.append("text")
      .attr("class", "xAxisLabel")
      .attr("x", groupWidth / 2)
      .attr("y", groupHeight + 140)
      .attr("font-size", 20)
      .attr("text-anchor", "middle")
      .text("Whe world's tallest buildings");

    g.append("text")
      .attr("class", "yAxisLabel")
      .attr("x", -groupHeight / 2)
      .attr("y", -60)
      .attr("font-size", 20)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Height (m)");

    /*
      READ READ READ READ READ READ READ READ READ READ READ

      In order for this d3.csv call to work, make sure you to do the following:
        1. npm install (make sure http-server is installed, dev dependency
            for local files)
        2. from another terminal/command line window, navigate to
            app/
        3. once in app/, run http-server ./ --cors="*"
        4. the above step 3 will setup a server allowing CORS, with the root
            located at app/ (so app/data/ages.csv is available)
    */
    const data = d3.json("http://localhost:8080/data/buildings.json").then(data => {
      data.forEach(d => d.height = +d.height);

      // setup band scaleLinear
      const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, groupWidth])
        .paddingInner(0.3)
        .paddingOuter(0.3);

      // setup y scale
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.height)])
        .range([groupHeight, 0]);

      // axis generators
      const xAxis = d3.axisBottom(x);
      g.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(0, ${groupHeight})`)
        .call(xAxis)
        .selectAll("text")
          .attr("y", 10)
          .attr("x", -5)
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-40)");

      const yAxis = d3.axisLeft(y)
        .ticks(3)
        .tickFormat(d => `${d}m`);
      g.append("g")
        .attr("class", "yAxis")
        .call(yAxis);

      // bars
      const rects = g.selectAll("rect").data(data);
      rects.enter()
        .append("rect")
        .attr("height", d => groupHeight - y(d.height))
        .attr("width", x.bandwidth())
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.height))
        .attr("fill", "grey");
    }).catch(err => console.log(err));

  }
}

export default App;
