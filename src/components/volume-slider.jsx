import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import styled from 'styled-components';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-right: 16px;
`;
const StyledSlider = styled(Slider)`
  margin: 0 16px;
`;

const VolumeSlider = ({ audioRef }) => {
  const [volume, setVolume] = useState(0.7);
  useEffect(() => {
    if (audioRef.current) {
      // eslint-disable-next-line no-param-reassign
      audioRef.current.volume = volume;
    }
  }, [volume]);
  const handleChange = (event, newValue) => {
    setVolume(newValue);
  };

  return (
    <Wrapper>
      <VolumeDown />
      <StyledSlider
        value={volume}
        onChange={handleChange}
        step={0.005}
        min={0.0}
        max={1.0}
      />
      <VolumeUp />
    </Wrapper>
  );
};

VolumeSlider.propTypes = {
  // https://stackoverflow.com/questions/48007326/what-is-the-correct-proptype-for-a-ref-in-react
  audioRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(HTMLInputElement) }),
  ]),
};

VolumeSlider.defaultProps = {
  audioRef: null,
};

export default VolumeSlider;
