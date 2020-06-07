const readAudioDurationInSeconds = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      audioContext.decodeAudioData(event.target.result, (buffer) => {
        resolve(buffer.duration);
      });
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });

export default readAudioDurationInSeconds;
