import React from 'react';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';

const DurationSlider = ({ data, audioRef }) => {
  if (data === null) return null;

  const { currentTime, duration } = data;
  const handleChange = (event, newValue) => {
    // eslint-disable-next-line no-param-reassign
    audioRef.current.currentTime = newValue * duration;
  };

  return (
    <>
      <Slider
        value={currentTime / duration}
        onChange={handleChange}
        step={1 / duration}
        min={0.0}
        max={1.0}
      />
    </>
  );
};

DurationSlider.propTypes = {
  data: PropTypes.exact({
    currentTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
  }),
  // https://stackoverflow.com/questions/48007326/what-is-the-correct-proptype-for-a-ref-in-react
  audioRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.object }),
  ]),
};

DurationSlider.defaultProps = {
  audioRef: { current: null },
  data: null,
};

export default DurationSlider;
