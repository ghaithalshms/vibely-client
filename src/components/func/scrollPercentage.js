const handleSetScrollPercentage = (setScrollingPercentage) => {
  const scrollingPercent =
    (window.scrollY /
      (document.scrollingElement.scrollHeight - window.innerHeight)) *
    100;

  setScrollingPercentage(scrollingPercent);
};

const handleAddScrollListener = (setScrollingPercentage) => {
  // SET SCROLLING PERCENTAGE LISTENER
  const debounce = (func, delay) => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(func, delay);
    };
  };

  // SCROLL EVENT FOR PC
  window.addEventListener(
    "wheel",
    debounce(() => {
      handleSetScrollPercentage(setScrollingPercentage);
    }, 300)
  );

  // SCROLL EVENT FOR MOBILE
  window.addEventListener(
    "touchmove",
    debounce(() => {
      handleSetScrollPercentage(setScrollingPercentage);
    }, 300)
  );
};

module.exports = { handleAddScrollListener };
