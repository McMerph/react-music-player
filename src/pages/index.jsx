// TODO Provide captions for media - https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/media-has-caption.md

import React, { createRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import VolumeSlider from '../components/volume-slider';

const Controls = styled.div`
  display: flex;
  align-items: center;
`;
const Input = styled.input`
  display: none;
`;

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });

const IndexPage = () => {
  const audioRef = createRef();
  const [src, setSrc] = useState(undefined);
  const [volume, setVolume] = useState(0.7);
  const onChange = async (event) => {
    const target = event.currentTarget;
    if (target.files && target.files[0]) {
      const data = await readFile(target.files[0]);
      setSrc(data);
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

      {src && (
        <>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio autoPlay src={src} ref={audioRef} />
          <Controls>
            <IconButton aria-label="play" color="primary" onClick={onPlay}>
              <PlayCircleOutlineIcon />
            </IconButton>
            <IconButton aria-label="pause" color="secondary" onClick={onPause}>
              <PauseCircleOutlineIcon />
            </IconButton>
            <VolumeSlider volume={volume} setVolume={setVolume} />
          </Controls>
        </>
      )}
    </>
  );
};

export default IndexPage;
