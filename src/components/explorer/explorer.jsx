import React from "react";
import ExplorerPostFlow from "../postFlow/explorerPostFlow";
import Navbar from "../navbar/navbar";

const Explorer = ({
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
      <ExplorerPostFlow
        isDarkMode={isDarkMode}
        handleCatchAxios={handleCatchAxios}
        scrollingPercentage={scrollingPercentage}
        setErrorCode={setErrorCode}
      />
    </div>
  );
};

export default Explorer;
