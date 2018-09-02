import $ from "jquery";
import Bootstrap from "bootstrap";
import "jquery-ui/ui/widgets/slider";
import "jquery-ui/themes/base/all.css";
import React from "react";

class VisualControl extends React.Component {
  render () {
    const {
      continentFilter, maxYear, minYear, playing, year
    } = this.props;

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

          <div id="slider-id">
            <label>Year: <span id="year">{year}</span></label>
            <div id="date-slider"></div>
          </div>
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

  attachSlider = () => {
    $("#date-slider").slider({
      max: 1,
      min: 0,
      // slide: (e, ui) => this.handleSliderUpdate(ui.value),
      slide: (e, ui) => this.handleSliderUpdate(ui.value),
      step: 1,
      value: 0
    });
  }

  componentDidMount () {
    this.attachSlider();
  }

  componentDidUpdate = () => {
    const { maxYear, minYear, year } = this.props;
    this.updateSliderParams(year, maxYear, minYear);
  }

  handleContinentFilterChange = e => {
    // doesn't work for select tags...so forcing rerender instead at the end
    e.preventDefault();

    // console.log(e.target.value);
    this.props.handleContinentFilterChange(e.target.value);
  };
  
  handlePlayToggle = () => this.props.handlePlayToggle();
  
  handleReset = () => this.props.handleReset();

  handleSliderUpdate = sliderVal => {
    this.props.handleSetYear(sliderVal - this.props.minYear);
  };

  updateSliderParams = (currYear, maxYear, minYear) => {
    const s = $("#date-slider");
    s.slider("option", "max", maxYear);
    s.slider("option", "min", minYear);
    s.slider("option", "value", currYear);
  };
}

export default VisualControl;
