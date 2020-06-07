const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;

const prettyPrintSeconds = (seconds) => {
  const hours = Math.floor(seconds / SECONDS_IN_HOUR);
  const minutes = Math.floor(
    (seconds - hours * SECONDS_IN_HOUR) / SECONDS_IN_MINUTE
  );
  const restSeconds = Math.floor(
    seconds - hours * SECONDS_IN_HOUR - minutes * SECONDS_IN_MINUTE
  );

  return [hours, minutes, restSeconds]
    .filter((v, i) => i > 0 || v > 0)
    .map((v) => String(v).padStart(2, '0'))
    .join(':');
};

export default prettyPrintSeconds;
