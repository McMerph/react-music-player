import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import styled from 'styled-components';
import readSrc from '../utils/read-src';
import readAudioDurationInSeconds from '../utils/read-audio-duration-in-seconds';
import prettyPrintSeconds from '../utils/pretty-print-seconds';
import Content from '../components/content';

const State = Object.freeze({
  Initial: 'Initial',
  Loading: 'Loading',
  Ready: 'Ready',
  Error: 'Error',
});

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
  const [audioData, setAudioData] = useState({
    state: State.Initial,
    src: null,
    list: [],
    error: null,
  });

  const onChange = async (event) => {
    const target = event.currentTarget;
    if (target.files && target.files[0]) {
      try {
        setAudioData((prev) => ({ ...prev, state: State.Loading }));
        const [src, list] = await Promise.all([
          readSrc(target.files[0]),
          getList(target.files),
        ]);
        setAudioData({ src, list, state: State.Ready });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setAudioData((prev) => ({ ...prev, state: State.Error, error }));
      }
    }
  };

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

      <Content
        state={audioData.state}
        src={audioData.src}
        list={audioData.list.map(({ file, duration }) => ({
          name: file.name,
          duration,
        }))}
      />
    </>
  );
};

export default IndexPage;
