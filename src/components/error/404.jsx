import React from "react";
import Navbar from "../navbar/navbar";

const Error404 = ({ isDarkMode }) => {
  return (
    <div className="main-container">
      <Navbar isDarkMode={isDarkMode} />
      <h3>Sorry, this page is not available.</h3>
      <Link to>Go back to Vibely</Link>
    </div>
  );
};
