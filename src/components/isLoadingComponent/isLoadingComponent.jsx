import React from "react";
import "./isLoadingComponent.css";

const IsLoadingComponent = () => {
  return (
    <div style={{ width: "100vw", height: "100svh" }}>
      <div className="loading-container">
        <div className="loading-icon"></div>
      </div>
    </div>
  );
};

export default IsLoadingComponent;
