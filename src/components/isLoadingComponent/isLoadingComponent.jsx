import React from "react";
import "./isLoadingComponent.css";

const LoadingIcon = () => {
  return <div className="loading-icon"></div>;
};

const LoadingContainer = () => {
  return (
    <div className="loading-container">
      <LoadingIcon />
    </div>
  );
};

const IsLoadingComponent = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <LoadingContainer />
    </div>
  );
};

export default IsLoadingComponent;
