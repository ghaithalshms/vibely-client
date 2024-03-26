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

  const initializeWaveSurfer = () => {
    const options = formWaveOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    wavesurfer.current.load(audioUrl);
    wavesurfer.current.on("ready", () => setLoading(false));
    wavesurfer.current.on("finish", () => setPlaying(false));
  };

  useEffect(() => {
    initializeWaveSurfer();
    return () => wavesurfer.current.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayPause = () => {
    setPlaying(!playing);
    wavesurfer.current.playPause();
  };

  const renderLoadingElement = () => (
    <div
      className="full-width"
      style={{ display: "flex", justifyContent: "center", margin: "15px 0" }}
    >
      <span className="loader" />
    </div>
  );

  const playPauseIcon = playing
    ? sentByTheUser || isDarkMode
      ? pauseIcon
      : pauseIconBlack
    : sentByTheUser || isDarkMode
    ? playIcon
    : playIconBlack;

  return (
    <>
      {loading && renderLoadingElement()}
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
          src={playPauseIcon}
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
