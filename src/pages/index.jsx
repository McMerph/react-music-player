import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import styled from 'styled-components';
import readSrc from '../utils/read-src';
import readAudioDurationInSeconds from '../utils/read-audio-duration-in-seconds';
import prettyPrintSeconds from '../utils/pretty-print-seconds';
import asyncPool from '../utils/async-pool';
import Stage from '../domain/stage';
import Content from '../components/content';
import AddFiles from '../components/add-files';

// TODO Make it adjustable? Store in localStorage?
const CONCURRENCY = 4;

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
    stage: Stage.Initial,
    list: [],
    file: null,
    src: null,
    error: null,
  });
  useEffect(() => {
    if (audioData.stage !== Stage.LoadingSrc) return;

    const handle = async () => {
      const src = await readSrc(audioData.file);
      setAudioData((prev) => ({ ...prev, stage: Stage.Ready, src }));
    };
    handle();
  }, [audioData.file]);

  const toPrevious = () => {
    setAudioData((prev) => {
      if (prev.list.length <= 1) return prev;

      const index = prev.list.findIndex((v) => v.file === prev.file);
      const prevIndex = index === 0 ? prev.list.length - 1 : index - 1;
      const { file } = prev.list[prevIndex];
      return { ...prev, stage: Stage.LoadingSrc, file };
    });
  };
  const toNext = () => {
    setAudioData((prev) => {
      if (prev.list.length <= 1) return prev;

      const index = prev.list.findIndex((v) => v.file === prev.file);
      const nextIndex = index === prev.list.length - 1 ? 0 : index + 1;
      const { file } = prev.list[nextIndex];
      return { ...prev, stage: Stage.LoadingSrc, file };
    });
  };
  const addFiles = async (files) => {
    try {
      setAudioData((prev) => ({ ...prev, stage: Stage.AddingFiles }));
      const [src, list] = await Promise.all([
        readSrc(files[0]),
        getList(Array.from(files)),
      ]);
      setAudioData((prev) => ({
        ...prev,
        stage: Stage.Ready,
        list: prev.list.concat(list),
        file: files[0],
        src,
      }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setAudioData((prev) => ({ ...prev, stage: Stage.Error, error }));
    }
  };

  return (
    <Wrapper>
      <IconButton aria-label="previous" color="primary" onClick={toPrevious}>
        <SkipPreviousIcon />
      </IconButton>
      <IconButton aria-label="next" color="primary" onClick={toNext}>
        <SkipNextIcon />
      </IconButton>

      <Content
        stage={audioData.stage}
        src={audioData.src}
        list={audioData.list.map(({ file, duration }) => ({
          current: audioData.file === file,
          name: file.name,
          duration,
        }))}
        toNext={toNext}
      />

      <AddFiles addFiles={addFiles} />
    </Wrapper>
  );
};

export default IndexPage;
