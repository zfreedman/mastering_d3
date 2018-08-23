import * as d3 from "d3";
import React from "react";

class App extends React.Component {
  render () {
    return (
      <div>
        <svg id="canvas" width="400" height="400" />
      </div>
    );
  }

  componentDidMount () {
    this.renderCircles();
  }

  renderCircles () {
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

      const svg = d3.select("#canvas");
      const rects = svg.selectAll("rect").data(data);

      // setup y scale
      const y = d3.scaleLinear()
        .domain([0, data.reduce(
          (acc, curr) => Math.max(acc, +curr.height), -1
        )])
        .range([0, 350]);

      rects.enter()
        .append("rect")
          .attr("height", d => y(d.height))
          .attr("width", 25)
          .attr("x", (d, i) => i * 50)
          .attr("y", 0)
          .attr("fill", "grey");
    }).catch(err => console.log(err));

  }
}

export default App;
