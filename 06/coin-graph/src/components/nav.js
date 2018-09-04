import React from "react";

export default () => {
  return (
    <nav className="navbar navbar-default">
      <div className="container">
        <a className="navbar-brand" href="#">
          <img id="logo" alt="logo" src={require("../img/logo.png")} />
        </a>      
      </div>
    </nav>
  );
};
