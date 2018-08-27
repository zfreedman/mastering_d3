import Bootstrap from "bootstrap";
import React from "react";

class VisualControl extends React.Component {
  render () {
    const { continentFilter, playing } = this.props;
    return (
      <div className="row">
        <div className="col-md-6">
          <button
            className="btn btn-primary"
            id="play-button"
            onClick={this.handlePlayToggle}
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            className="btn btn-primary"
            id="reset-button"
            onClick={this.handleReset}
          >
            Reset
          </button>
        </div>

        <div className="col-md-6">
          <select
            className="form-control"
            id="continent-select"
            onChange={this.handleContinentFilterChange}
            value={continentFilter}
          >
            <option value="all">All</option>
            <option value="europe">Europe</option>
            <option value="asia">Asia</option>
            <option value="americas">Americas</option>
            <option value="africa">Africa</option>
          </select>
        </div>
      </div>
    );
  }

  handleContinentFilterChange = e => {
    // doesn't work for select tags...so forcing rerender instead at the end
    e.preventDefault();

    // console.log(e.target.value);
    this.props.handleContinentFilterChange(e.target.value);
  };

  handlePlayToggle = () => this.props.handlePlayToggle();

  handleReset = () => this.props.handleReset();
}

export default VisualControl;
