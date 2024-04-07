const handleCache = (type, url, id, setFile, setLoaded) => {
  const cachedFile = localStorage.getItem(`${type}_${id}`);
  if (cachedFile && cachedFile !== "defaultPfp") {
    setFile(cachedFile);
    setLoaded(true);
  } else {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network erroR");
        }
        return response.blob();
      })
      .then((blob) => {
        if (blob.type.startsWith("text")) {
          addItemWithSpaceManagement(`${type}_${id}`, "defaultPfp");
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            const base64Data = reader.result;
            addItemWithSpaceManagement(`${type}_${id}`, base64Data);
            setFile(base64Data);
            setLoaded(true);
          };
          reader.readAsDataURL(blob);
        }
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }
};

function addItemWithSpaceManagement(key, value) {
  if (value.length > 2 * 1024 * 1024) {
    return;
  }
  while (isThereFreeStorage(value)) {
    const oldestKey = Object.keys(localStorage)[0];
    localStorage.removeItem(oldestKey);
  }

  localStorage.setItem(key, value);
}

function isThereFreeStorage(value) {
  const localStorageSize = Object.keys(localStorage).reduce((total, key) => {
    return total + localStorage.getItem(key).length;
  }, 0);

  const newValueSize = value.length;

  return localStorageSize + newValueSize > 5 * 1024 * 1024;
}

export default handleCache;
