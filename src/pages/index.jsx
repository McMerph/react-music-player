import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import styled from 'styled-components';
import readSrc from '../utils/read-src';
import readAudioDurationInSeconds from '../utils/read-audio-duration-in-seconds';
import prettyPrintSeconds from '../utils/pretty-print-seconds';
import asyncPool from '../utils/async-pool';
import State from '../domain/state';
import Content from '../components/content';

// TODO Make it adjustable? Store in localStorage?
const CONCURRENCY = 4;

const Input = styled.input`
  display: none;
`;
const Wrapper = styled.div`
  max-width: 360px;
  padding: 0 12px;
`;

const getList = async (files) => {
  const durations = await asyncPool(
    CONCURRENCY,
    files,
    readAudioDurationInSeconds
  );

  return files.map((file, i) => ({
    file,
    duration: prettyPrintSeconds(durations[i]),
  }));
};

const IndexPage = () => {
  const [audioData, setAudioData] = useState({
    state: State.Initial,
    list: [],
    file: null,
    src: null,
    error: null,
  });
  useEffect(() => {
    if (audioData.state !== State.LoadingSrc) return;

    const handle = async () => {
      const src = await readSrc(audioData.file);
      setAudioData((prev) => ({ ...prev, state: State.Ready, src }));
    };
    handle();
  }, [audioData.file]);

  const toNext = () => {
    setAudioData((prev) => {
      if (prev.list.length <= 1) return prev;

      const index = prev.list.findIndex((v) => v.file === prev.file);
      const nextIndex = index === prev.list.length - 1 ? 0 : index + 1;
      const { file } = prev.list[nextIndex];
      return { ...prev, state: State.LoadingSrc, file };
    });
  };
  const addFiles = async (event) => {
    const target = event.currentTarget;
    if (target.files && target.files[0]) {
      try {
        setAudioData((prev) => ({ ...prev, state: State.AddingFiles }));
        const [src, list] = await Promise.all([
          readSrc(target.files[0]),
          getList(Array.from(target.files)),
        ]);
        setAudioData((prev) => ({
          ...prev,
          state: State.Ready,
          list: prev.list.concat(list),
          file: target.files[0],
          src,
        }));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setAudioData((prev) => ({ ...prev, state: State.Error, error }));
      }
    }
  };

  return (
    <Wrapper>
      <Input
        id="files-chooser"
        type="file"
        accept=".mp3,.flac,.ogg,.wav"
        multiple
        onChange={addFiles}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="files-chooser">
        <IconButton aria-label="add file(s)" component="span">
          <AddCircleOutlineIcon />
        </IconButton>
      </label>
      <IconButton aria-label="next" color="primary" onClick={toNext}>
        <SkipNextIcon />
      </IconButton>

      <Content
        state={audioData.state}
        src={audioData.src}
        list={audioData.list.map(({ file, duration }) => ({
          current: audioData.file === file,
          name: file.name,
          duration,
        }))}
        toNext={toNext}
      />
    </Wrapper>
  );
};

export default IndexPage;
