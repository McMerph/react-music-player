// TODO Provide captions for media - https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/media-has-caption.md

import { assocPath } from 'ramda';
import React, {
  createRef,
  useRef,
  useCallback,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import visualize from '../utils/visualize';
import Stage from '../domain/stage';
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

const Content = ({ stage, src, list, repeat, setAudioData }) => {
  const endedRef = useRef(false);
  const defaultLoop = useSelector((state) => state.defaultLoop);
  const [trackInfo, setTrackInfo] = useState(null);
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
  const getNextIndex = (arr, index) =>
    index === arr.length - 1 ? 0 : index + 1;
  const getPreviousIndex = (arr, index) =>
    index === 0 ? arr.length - 1 : index - 1;
  const toNeighbor = (forward) => {
    setAudioData((prev) => {
      if (prev.list.length <= 1) return prev;

      const index = prev.list.findIndex((v) => v.file === prev.file);
      if (!repeat) {
        if (forward && index === prev.list.length - 1) return prev;
        if (!forward && index === 0) return prev;
      }
      const neighborIndex = forward
        ? getNextIndex(prev.list, index)
        : getPreviousIndex(prev.list, index);
      const { file } = prev.list[neighborIndex];
      return { ...prev, stage: Stage.ChangeFile, file };
    });
  };
  const [toPrevious, toNext] = [false, true].map((forward) => () => {
    toNeighbor(forward);
  });
  const currentIndex = list.findIndex((v) => v.current);
  useEffect(() => {
    if (endedRef.current) {
      if (list[currentIndex].loop === defaultLoop) {
        toNext();
      } else {
        audioRef.current.currentTime = 0;
        play();
      }
      endedRef.current = false;
    }
  }, [list]);

  if (stage === Stage.Initial) return null;
  if (stage === Stage.AddingFiles)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  if (stage === Stage.Error)
    return (
      <div>
        <ErrorOutlineIcon color="secondary" />
      </div>
    );

  const firstTrack = list[0].current;
  const lastTrack = list[list.length - 1].current;
  const toggleRepeat = () => {
    setAudioData((prev) => ({ ...prev, repeat: !prev.repeat }));
  };
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
          setTrackInfo({ currentTime, duration });
          if (audioRef.current.ended) {
            endedRef.current = true;
            setAudioData((prev) =>
              assocPath(
                ['list', currentIndex, 'loop'],
                list[currentIndex].loop <= 1
                  ? defaultLoop
                  : list[currentIndex].loop - 1,
                prev
              )
            );
          }
        }}
      />
      <DurationSlider data={trackInfo} audioRef={audioRef} />
      <Controls>
        <IconButton
          aria-label="previous"
          color="primary"
          disabled={list.length <= 1 || (!repeat && firstTrack)}
          onClick={toPrevious}
        >
          <SkipPreviousIcon />
        </IconButton>
        <IconButton aria-label="play" color="primary" onClick={play}>
          <PlayCircleOutlineIcon />
        </IconButton>
        <IconButton aria-label="pause" color="secondary" onClick={pause}>
          <PauseCircleOutlineIcon />
        </IconButton>
        <IconButton
          aria-label="next"
          color="primary"
          disabled={list.length <= 1 || (!repeat && lastTrack)}
          onClick={toNext}
        >
          <SkipNextIcon />
        </IconButton>
        <IconButton
          aria-label="repeat"
          color={repeat ? 'primary' : 'default'}
          onClick={toggleRepeat}
        >
          <RepeatIcon />
        </IconButton>
        <VolumeSlider audioRef={audioRef} />
      </Controls>
      <Playlist list={list} setAudioData={setAudioData} />
    </>
  );
};

Content.propTypes = {
  stage: PropTypes.oneOf(Object.values(Stage)).isRequired,
  list: PropTypes.arrayOf(
    PropTypes.exact({
      current: PropTypes.bool.isRequired,
      file: PropTypes.instanceOf(File),
      loop: PropTypes.number.isRequired,
      duration: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  repeat: PropTypes.bool.isRequired,
  src: PropTypes.string,
  setAudioData: PropTypes.func.isRequired,
};
Content.defaultProps = { src: null };

export default Content;
