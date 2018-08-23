import React from "react";

class App extends React.Component {
  render () {
    let x1 = 185;
    let x2 = 230;
    let y1 = 5;
    let y2 = 55;

    return (
      <div>
        <svg width="400" height="60">
          <rect
            fill="purple"
            height="50"
            stroke="grey"
            strokeWidth="5px"
            width="50"
            x="5"
            y="5"
          />

          <circle
            cx={90}
            cy={30}
            fill="pink"
            r={30}
          />

          <ellipse
            cx={145}
            cy={30}
            fill="white"
            rx={15}
            ry={25}
          />

          <line
            x1={x1}
            x2={x2}
            y1={y1}
            y2={y2}
            stroke="blue"
            strokeWidth={10}
          />

          <text
            fill="orange"
            fontSize={20}
            textAnchor="middle"
            x={260}
            y={25}
          >
            Hello world
          </text>
        </svg>

        <svg height={160} width={190} xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"
            stroke="white"
            strokeWidth={3}
          />
        </svg>
      </div>
    );
  }
}

export default App;
