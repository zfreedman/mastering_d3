import * as d3 from "d3";
import React from "react";

class App extends React.Component {
  render () {
    return (
      <div>
        <svg id="canvas" width="400" height="60" />
      </div>
    );
  }

  componentDidMount () {
    this.renderCircles();
  }

  renderCircles () {
    const data = [...Array(10).keys()].map(e => e * 2);

    const svg = d3.select("#canvas");
    const circles = svg.selectAll("circle").data(data);

    circles.enter()
      .append("circle")
        .attr("cx", (d, i) => i * 25)
        .attr("cy", d => d)
        .attr("r", d => d)
        .attr("fill", "purple");
  }
}

export default App;
