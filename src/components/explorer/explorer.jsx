import React from "react";
import ExplorerPostFlow from "../postFlow/explorerPostFlow";
import Navbar from "../navbar/navbar";

const Explorer = ({
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

  const renderExplorerPostFlow = () => (
    <ExplorerPostFlow
      isDarkMode={isDarkMode}
      handleCatchAxios={handleCatchAxios}
      scrollingPercentage={scrollingPercentage}
      setErrorCode={setErrorCode}
    />
  );

  return (
    <div className="container-y  main-container">
      {renderNavbar()}
      {renderExplorerPostFlow()}
    </div>
  );
};

export default Explorer;
