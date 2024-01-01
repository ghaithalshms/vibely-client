import React, { useState } from "react";
import DialogModal from "../dialogModal/dialogModal";
import ExplorerPostFlow from "../postfFow/explorerPostFlow";
import Navbar from "../navbar/navbar";

const Explorer = ({ isDarkMode, scrollingPercentage }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogModalHeader, setDialogModalHeader] = useState("");
  const [dialogModalBody, setDialogModalBody] = useState("");

  const handleCatchAxios = (err) => {
    setDialogOpen(true);
    setDialogModalHeader("Ooups");
    if (err?.code === "ERR_NETWORK")
      setDialogModalBody(
        `Sorry, a problem happened while connecting to the server`
      );
    else
      setDialogModalBody(`Sorry, an error happened: ${err?.response?.status}`);
  };

  return (
    <div className="container-y  main-container">
      <Navbar isDarkMode={isDarkMode} handleCatchAxios={handleCatchAxios} />
      <ExplorerPostFlow
        isDarkMode={isDarkMode}
        handleCatchAxios={handleCatchAxios}
        scrollingPercentage={scrollingPercentage}
      />

      {isDialogOpen && (
        <DialogModal
          isDarkMode={isDarkMode}
          isOpen={isDialogOpen}
          header={dialogModalHeader}
          body={dialogModalBody}
          onNo={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default Explorer;
