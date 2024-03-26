import React from "react";
import Navbar from "../navbar/navbar";
import ActivitiesPostFlow from "../postFlow/activitiesPostFlow";

const Activities = ({
  isDarkMode,
  scrollingPercentage,
  handleCatchAxios,
  setErrorCode,
}) => {
  const renderNavbar = () => (
    <Navbar
      isDarkMode={isDarkMode}
      handleCatchAxios={handleCatchAxios}
      setErrorCode={setErrorCode}
    />
  );

  const renderActivitiesPostFlow = () => (
    <ActivitiesPostFlow
      isDarkMode={isDarkMode}
      handleCatchAxios={handleCatchAxios}
      scrollingPercentage={scrollingPercentage}
      setErrorCode={setErrorCode}
    />
  );

  return (
    <div className="container-y  main-container">
      {renderNavbar()}
      <br />
      {renderActivitiesPostFlow()}
    </div>
  );
};

export default Activities;
