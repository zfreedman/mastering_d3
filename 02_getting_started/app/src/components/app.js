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
    this.doD3();
  }

  doD3 () {
    const svg = d3.select("#canvas");
    const rect = svg.append("rect")
      .attr("x", 25)
      .attr("y", 5)
      .attr("width", 150)
      .attr("height", 50)
      .attr("fill", "blue");
  }
}

export default App;
