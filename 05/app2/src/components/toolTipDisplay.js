import * as d3 from "d3";
import React from "react";

const ToolTipDisplay = props => {
  const { continent, country, income, life_exp, population } = props.data;

  return (
    <div>
      <strong>Country:</strong> <span style={{color: "red"}}>{country}</span><br />

      <strong>Continent:</strong> <span
        style={{
          color: "red",
          textTransform: "capitalize",
        }}
      >
        {continent}
      </span><br />

      <strong>Life Expectancy:</strong> <span
        style={{
          color: "red"
        }}
      >
        {d3.format(".2f")(life_exp)}
      </span><br />

      <strong>GDP Per Capita:</strong> <span
        style={{
          color: "red"
        }}
      >
        {d3.format("$,.0f")(income)}
      </span><br />

      <strong>Population:</strong> <span
        style={{
          color: "red"
        }}
      >
        {d3.format(",.0f")(population)}
      </span><br />
    </div>
  );
};

export default ToolTipDisplay;
