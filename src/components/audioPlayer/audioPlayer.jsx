import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import playIcon from "../icon/light-mode/chat/play.png";
import pauseIcon from "../icon/light-mode/chat/pause.png";
import playIconBlack from "../icon/light-mode/chat/play-black.png";
import pauseIconBlack from "../icon/light-mode/chat/pause-black.png";

const AudioPlayer = ({ isDarkMode, audioUrl, sentByTheUser }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const formWaveOptions = (ref) => ({
    container: ref,
    waveColor: sentByTheUser
      ? isDarkMode
        ? "#ff5eb4"
        : "#ffa5d5"
      : isDarkMode
      ? "#595959"
      : "#9c9c9c",
    progressColor: !sentByTheUser && !isDarkMode ? "#292929" : "#fff",
    barRadius: 4,
    barWidth: 4,
    barGap: 6,
    height: 40,
    backend: "WebAudio",
    normalize: true,
    responsive: true,
  });

  useEffect(() => {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const options = formWaveOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    wavesurfer.current.load(proxyUrl + audioUrl);
    wavesurfer.current.on("ready", () => setLoading(false));
    wavesurfer.current.on("finish", () => setPlaying(false));
    return () => wavesurfer.current.destroy();
    // eslint-disable-next-line
  }, []);

  const handlePlayPause = () => {
    setPlaying(!playing);
    wavesurfer.current.playPause();
  };

  const loadingElement = (
    <div
      className="full-width"
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "15px 0",
      }}
    >
      <span className="loader" />
    </div>
  );

  return (
    <>
      {loading && loadingElement}
      <div
        style={{
          width: "250px",
          maxWidth: "70vw",
          display: loading ? "none" : "flex",
        }}
      >
        <img
          className="pointer"
          onClick={handlePlayPause}
          src={
            playing
              ? !sentByTheUser && !isDarkMode
                ? pauseIconBlack
                : pauseIcon
              : !sentByTheUser && !isDarkMode
              ? playIconBlack
              : playIcon
          }
          alt="play-pause"
          style={{
            height: "30px",
            width: "30px",
            marginRight: "10px",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        />
        <div
          id="waveform"
          ref={waveformRef}
          style={{ maxWidth: "50wv", width: "100%" }}
        />
      </div>
    </>
  );
};

export default AudioPlayer;
