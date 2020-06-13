// TODO Provide captions for media - https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/media-has-caption.md

import React, { createRef, useRef, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import visualize from '../utils/visualize';
import State from '../domain/state';
import DurationSlider from './duration-slider';
import VolumeSlider from './volume-slider';
import Playlist from './playlist';

const Controls = styled.div`
  display: flex;
  align-items: center;
`;
const Canvas = styled.canvas`
  height: 48px;
  width: 100%;
`;

const Content = ({ state, src, list, toNext }) => {
  const [audioData, setAudioData] = useState(null);
  const audioRef = useRef(null);
  const canvasRef = createRef();
  // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const audioCallback = useCallback((node) => {
    if (node !== null && node !== audioRef.current) {
      audioRef.current = node;
      visualize(node, canvasRef.current);
    }
  });
  const [play, pause] = ['play', 'pause'].map((action) => () => {
    audioRef.current[action]();
  });

  if (state === State.Initial) return null;
  if (state === State.AddingFiles || state === State.LoadingSrc)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  if (state === State.Error)
    return (
      <div>
        <ErrorOutlineIcon color="secondary" />
      </div>
    );

  return (
    <>
      <Canvas ref={canvasRef} />
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        autoPlay
        src={src}
        ref={audioCallback}
        onTimeUpdate={() => {
          const { currentTime, duration } = audioRef.current;
          setAudioData({ currentTime, duration });
          if (audioRef.current.ended) {
            toNext();
          }
        }}
      />
      <DurationSlider data={audioData} audioRef={audioRef} />
      <Controls>
        <IconButton aria-label="play" color="primary" onClick={play}>
          <PlayCircleOutlineIcon />
        </IconButton>
        <IconButton aria-label="pause" color="secondary" onClick={pause}>
          <PauseCircleOutlineIcon />
        </IconButton>
        <VolumeSlider audioRef={audioRef} />
      </Controls>
      <Playlist data={list} />
    </>
  );
};

Content.propTypes = {
  state: PropTypes.oneOf(Object.values(State)).isRequired,
  list: PropTypes.arrayOf(
    PropTypes.exact({
      current: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  src: PropTypes.string,
  toNext: PropTypes.func.isRequired,
};
Content.defaultProps = { src: null };

export default Content;
