import React from "react";
import config from "../../config/config";

class About extends React.Component {
  render() {
    return (
      <div>
        <div className="content">
          <div className="vertical-content">
            <h1>About</h1>
            <p>We are {config.APP_NAME}!</p>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
