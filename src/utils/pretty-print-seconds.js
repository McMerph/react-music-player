const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;

const prettyPrintSeconds = (seconds) => {
  const hours = Math.floor(seconds / SECONDS_IN_HOUR);
  let minutes = Math.floor(
    (seconds - hours * SECONDS_IN_HOUR) / SECONDS_IN_MINUTE
  );
  let restSeconds = Math.round(
    seconds - hours * SECONDS_IN_HOUR - minutes * SECONDS_IN_MINUTE
  );
  if (restSeconds === SECONDS_IN_MINUTE) {
    restSeconds = 0;
    minutes += 1;
  }

  return [hours, minutes, restSeconds]
    .filter((v, i) => i > 0 || v > 0)
    .map((v) => String(v).padStart(2, '0'))
    .join(':');
};

export default prettyPrintSeconds;
