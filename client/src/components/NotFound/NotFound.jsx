import React from "react";

function NotFound(props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>404: Oops, {props.message}</h2>
    </div>
  );
}

export default NotFound;
