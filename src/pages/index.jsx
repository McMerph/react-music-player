// TODO Handle errors!
// TODO Provide captions for media - https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/media-has-caption.md

import React, { createRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import readSrc from '../utils/read-src';
import readAudioDurationInSeconds from '../utils/read-audio-duration-in-seconds';
import prettyPrintSeconds from '../utils/pretty-print-seconds';
import VolumeSlider from '../components/volume-slider';
import Playlist from '../components/playlist';

const Controls = styled.div`
  display: flex;
  align-items: center;
  max-width: 360px;
`;
const Input = styled.input`
  display: none;
`;

const getList = async (files) => {
  const durations = await Promise.all(
    Array.from(files).map(readAudioDurationInSeconds)
  );
  return durations.map((duration, i) => ({
    file: files[i],
    duration: prettyPrintSeconds(duration),
  }));
};

const IndexPage = () => {
  const audioRef = createRef();
  const [audioData, setAudioData] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const onChange = async (event) => {
    const target = event.currentTarget;
    if (target.files && target.files[0]) {
      const [src, list] = await Promise.all([
        readSrc(target.files[0]),
        getList(target.files),
      ]);
      setAudioData({ src, list });
    }
  };
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const [onPlay, onPause] = ['play', 'pause'].map((action) => () => {
    if (audioRef.current) {
      audioRef.current[action]();
    }
  });

  return (
    <>
      <Input
        id="files-chooser"
        type="file"
        accept=".mp3,.flac,.ogg,.wav"
        multiple
        onChange={onChange}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="files-chooser">
        <IconButton aria-label="add file(s)" component="span">
          <AddCircleOutlineIcon />
        </IconButton>
      </label>

      {audioData && (
        <>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio autoPlay src={audioData.src} ref={audioRef} />
          <Controls>
            <IconButton aria-label="play" color="primary" onClick={onPlay}>
              <PlayCircleOutlineIcon />
            </IconButton>
            <IconButton aria-label="pause" color="secondary" onClick={onPause}>
              <PauseCircleOutlineIcon />
            </IconButton>
            <VolumeSlider volume={volume} setVolume={setVolume} />
          </Controls>
          <Playlist
            data={audioData.list.map(({ file, duration }) => ({
              name: file.name,
              duration,
            }))}
          />
        </>
      )}
    </>
  );
};

export default IndexPage;
