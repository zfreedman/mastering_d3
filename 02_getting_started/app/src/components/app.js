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

    const data = d3.csv("http://localhost:8080/data/ages.csv").then(data => {
      data.forEach(d => d.age = +d.age);

      const svg = d3.select("#canvas");
      const circles = svg.selectAll("circle").data(data);

      circles.enter()
        .append("circle")
          .attr("cx", (d, i) => i * 50 + 25)
          .attr("cy", 25)
          .attr("r", d => d.age * 2)
          .attr("fill", d => d.name === "Tony" ? "blue" : "purple");
    }).catch(err => console.log(err));

  }
}

export default App;
