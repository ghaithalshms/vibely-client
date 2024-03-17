import React from "react";
import Navbar from "../navbar/navbar";
import ActivitiesPostFlow from "../postFlow/activitiesPostFlow";

const Activities = ({
  isDarkMode,
  scrollingPercentage,
  handleCatchAxios,
  setErrorCode,
}) => {
  return (
    <div className="container-y  main-container">
      <Navbar
        isDarkMode={isDarkMode}
        handleCatchAxios={handleCatchAxios}
        setErrorCode={setErrorCode}
      />
      <br />
      <ActivitiesPostFlow
        isDarkMode={isDarkMode}
        handleCatchAxios={handleCatchAxios}
        scrollingPercentage={scrollingPercentage}
        setErrorCode={setErrorCode}
      />
    </div>
  );
};

export default Activities;
