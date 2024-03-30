const cachePostInBrowser = (postData) => {
  // Ensure the Cache API is available
  if ("caches" in window) {
    // Define the name of the cache
    const CACHE_NAME = "posts-cache";

    // Open the cache storage
    caches.open(CACHE_NAME).then((cache) => {
      // Cache the postData using the postID as the key
      const postID = postData.postID;
      const cacheKey = `post-${postID}`;

      // Store the postData in the cache
      cache.put(cacheKey, new Response(JSON.stringify(postData)));
    });
  } else {
    console.error("Cache API is not supported in this browser.");
  }
};

export { cachePostInBrowser };
