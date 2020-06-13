import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import styled from 'styled-components';
import ActionType from '../store/action-type';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-right: 12px;
`;

const VolumeSlider = ({ audioRef }) => {
  const volume = useSelector((state) => state.volume);
  const dispatch = useDispatch();
  useEffect(() => {
    if (audioRef.current) {
      // eslint-disable-next-line no-param-reassign
      audioRef.current.volume = volume;
    }
  }, [volume]);
  const handleChange = (event, newVolume) => {
    dispatch({ type: ActionType.SetVolume, volume: newVolume });
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
    </Wrapper>
  );
};

VolumeSlider.propTypes = {
  // https://stackoverflow.com/questions/48007326/what-is-the-correct-proptype-for-a-ref-in-react
  audioRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.object }),
  ]),
};

VolumeSlider.defaultProps = {
  audioRef: { current: null },
};

export default VolumeSlider;
