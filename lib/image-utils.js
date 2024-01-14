const loadedImage = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (err) => {
      reject(err);
    };
    image.src = url;
  });
};
