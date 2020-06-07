import React from 'react';
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

const VolumeSlider = ({ volume, setVolume }) => {
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
  volume: PropTypes.number.isRequired,
  setVolume: PropTypes.func.isRequired,
};

export default VolumeSlider;
