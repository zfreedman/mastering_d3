import * as d3 from "d3";
import d3Tip from "d3-tip";
import React from "react";
import { renderToString } from "react-dom/server";

import ToolTipDisplay from "components/toolTipDisplay";
import VisualControl from "components/visualControl";

class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      continentFilter: "all",
      dataFetched: false,
      interval: undefined,
    };
  }

  render () {
    const { continentFilter, interval } = this.state;
    return (
      <div className="container">
        <VisualControl
          continentFilter={continentFilter}
          handleContinentFilterChange={this.handleContinentFilterChange}
          handlePlayToggle={this.handlePlayToggle}
          handleReset={this.handleReset}
          handleSetYear={this.handleSetYear}
          maxYear={
            this.data !== undefined
              ? +this.data[this.data.length - 1].year
              : -1
          }
          minYear={
            this.data !== undefined
              ? +this.data[0].year
              : -1
          }
          playing={interval !== undefined}
          year={
            this.state.yearIndex !== undefined
              ? +this.data[this.state.yearIndex].year
              : ""
            }
        />

        <div className="row">
          <div className="col-md-12">
            <div id="d3Target">
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount () {
    this.fetchAndPlaceData();
  }

  fetchAndPlaceData () {
    d3.json("http://localhost:8080/data/data.json").then(data => {
      this.data = data;

      const newYearIndex = 0;
      this.setState({ dataFetched: true, yearIndex: newYearIndex });

      this.initVisual();

      this.updateVisual(this.data[newYearIndex], this.state.continentFilter);
    });
  }

  getPopulationDomain () {
    return this.data.reduce((largestRange, yearData) => {
      const minAndMax = yearData.countries.reduce((currRange, countryData) => {
        let min = currRange[0];
        let max = currRange[1];

        min = countryData.population !== null && +countryData.population < min
          ? +countryData.population
          : min;
        max = countryData.population !== null && max < +countryData.population
          ? +countryData.population
          : max;

        return [min, max];
      }, [100000, 100000]);

      let bestMin = minAndMax[0];
      let bestMax = minAndMax[1];

      bestMin = largestRange[0] < bestMin
        ? largestRange[0]
        : bestMin;
      bestMax = bestMax < largestRange[1]
        ? largestRange[1]
        : bestMax;

      return [bestMin, bestMax]
    }, [100000, 100000]);
  }

  handleContinentFilterChange = continentFilter => {
    this.setState({
      continentFilter,
    });

    // update visual if not playing
    const { interval, yearIndex } = this.state;
    const playing = interval !== undefined;
    if (!playing)
      this.updateVisual(this.data[yearIndex], continentFilter);
  };

  handlePlayToggle = () => {
    const { interval } = this.state;
    const newInterval = interval === undefined
      ? setInterval(this.stepVisual, this.updateRate)
      : clearInterval(interval);

    this.setState({
      interval: newInterval,
    });
  };

  handleReset = () => {
    const newYearIndex = 0;
    const { continentFilter, interval } = this.state;

    this.setState({
      interval: clearInterval(interval),
      yearIndex: newYearIndex,
    });

    this.updateVisual(this.data[newYearIndex], continentFilter);
  };

  handleSetYear = yearIndex => {
    this.setState({
      yearIndex
    });

    this.updateVisual(this.data[yearIndex], this.state.continentFilter);
  };

  initVisual () {
    const continents = ["africa", "americas", "europe", "asia"]

    this.updateRate = 100;

    this.margin = { bottom: 100, left: 80, right: 20, top: 50 };
    const { margin } = this;
    const { bottom, left, right, top } = margin;

    this.height = 400 - margin.top - margin.bottom;
    this.width = 600 - margin.left - margin.right;
    const { height, width } = this;

    this.area = d3.scaleLinear()
      .domain(this.getPopulationDomain())
      .range([5, 25]);
    this.color = d3.scaleOrdinal()
      .domain(continents)
      .range(d3.schemeCategory10);
    this.x = d3.scaleLog()
      .domain([300, 150000])
      .range([0, this.width]);
    this.y = d3.scaleLinear()
      .domain([0, 90])
      .range([this.height, 0]);

    this.g = d3.select("#d3Target")
      .append("svg")
        .attr("width", width + left + right)
        .attr("height", height + top + bottom)
      .append("g")
        .attr("transform", `translate(${left}, ${top})`);
    const { g } = this;

    this.xAxisGroup = g.append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0, ${height})`);
    this.yAxisGroup = g.append("g")
      .attr("class", "yAxis");

    g.append("text")
      .attr("y", height + 50)
      .attr("x", width / 2)
      .attr("font-size", 20)
      .attr("text-anchor", "middle")
      .text("GDP Per Capita ($)");
    g.append("text")
        .attr("y", -60)
        .attr("x", -height / 2)
        .attr("font-size", 20)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Life Expectancy (Years)");

    this.yearLabel = g.append("text")
      .attr("y", height - 10)
      .attr("x", width * 6 / 7)
      .attr("font-size", 48)
      .attr("text-anchor", "middle")
      .attr("opacity", 0.5)
      .text(this.data[0].year);

    // legend
    const legend = g.append("g")
      .attr("transform", `translate(${width - 10}, ${height - 125})`);
    continents.forEach((c, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", this.color(c));
      legendRow.append("text")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .text(c);
    });

    // tool tip
    this.tip = d3Tip()
      .attr("class", "d3-tip")
      .html(d => renderToString(<ToolTipDisplay data={d} />));
    g.call(this.tip);
  }

  stepVisual = () => {
    const { continentFilter, yearIndex } = this.state;
    const newYearIndex = (yearIndex + 1) % this.data.length;

    this.setState({
      yearIndex: newYearIndex
    });

    this.updateVisual(this.data[newYearIndex], continentFilter);
  }

  updateVisual = (data, continentFilter) => {
    const {
      area, color, g, height, tip, x, xAxisGroup, y, yAxisGroup, yearLabel
    } = this;

    const t = d3.transition().duration(this.updateRate);

    const xAxisCall = d3.axisBottom(x)
      .tickValues([400, 4000, 40000])
      .tickFormat(n => `$${n}`);
    xAxisGroup.call(xAxisCall);

    const yAxisCall = d3.axisLeft(y);
    yAxisGroup.call(yAxisCall);

    // filter data for null values
    let { countries, year } = data;
    countries = countries.filter(c => {

      const continentPass = (
        continentFilter === "all" || c.continent === continentFilter
      );

      return c.income !== null && c.life_exp != null && continentPass;
    });


    // JOIN new data
    const circles = g.selectAll("circle")
      .data(countries, d => d.country);

    // EXIT old elements
    circles.exit().remove();

    // ENTER (and UPDATE, merge) new elements present in data
    circles.enter()
      .append("circle")
        .attr("fill", d => color(d.continent))
        .attr("opacity", 0.5)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .merge(circles)
        .transition(t)
          .attr("cx", d => x(d.income))
          .attr("cy", d => y(d.life_exp))
          .attr("r", d => area(d.population));

    // Update year Label
    yearLabel
      .transition(t)
      .text(year);
  }
}

export default App;
