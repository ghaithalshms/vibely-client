import React, { useState } from "react";
import DialogModal from "../dialogModal/dialogModal";
import HomePostFlow from "../postfFow/homePostFlow";
import Navbar from "../navbar/navbar";
import CreatePost from "../createPost/createPost";

const Home = ({ isDarkMode, scrollingPercentage }) => {
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
      <CreatePost isDarkMode={isDarkMode} handleCatchAxios={handleCatchAxios} />
      <br />
      <HomePostFlow
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

export default Home;
