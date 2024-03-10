import React from "react";
import ExplorerPostFlow from "../postFlow/explorerPostFlow";
import Navbar from "../navbar/navbar";

const Explorer = ({ isDarkMode, scrollingPercentage, handleCatchAxios }) => {
  return (
    <div className="container-y  main-container">
      <Navbar isDarkMode={isDarkMode} handleCatchAxios={handleCatchAxios} />
      <ExplorerPostFlow
        isDarkMode={isDarkMode}
        handleCatchAxios={handleCatchAxios}
        scrollingPercentage={scrollingPercentage}
      />
    </div>
  );
};

export default Explorer;
