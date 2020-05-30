import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const VolumeSlider = ({ volume, setVolume }) => {
  const handleChange = (event, newValue) => {
    setVolume(newValue);
  };

  return (
    <Wrapper>
      <VolumeDown />
      <Slider
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
  volume: PropTypes.number.isRequired,
  setVolume: PropTypes.func.isRequired,
};

export default VolumeSlider;
