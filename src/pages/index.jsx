import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  padding: 12px 12px 0;
`;

const getList = async (files, loop) => {
  const durations = await asyncPool(
    CONCURRENCY,
    files,
    readAudioDurationInSeconds
  );

  return files.map((file, i) => ({
    file,
    loop,
    duration: prettyPrintSeconds(durations[i]),
  }));
};

const IndexPage = () => {
  const defaultLoop = useSelector((state) => state.defaultLoop);
  const [audioData, setAudioData] = useState({
    stage: Stage.Initial,
    repeat: false,
    list: [],
    file: null,
    src: null,
    error: null,
  });
  useEffect(() => {
    if (audioData.stage !== Stage.ChangeFile) return;

    const handle = async () => {
      const src = await readSrc(audioData.file);
      setAudioData((prev) => ({ ...prev, stage: Stage.Ready, src }));
    };
    handle();
  }, [audioData.file]);

  const addFiles = async (files) => {
    try {
      setAudioData((prev) => ({ ...prev, stage: Stage.AddingFiles }));
      const [src, list] = await Promise.all([
        readSrc(files[0]),
        getList(Array.from(files), defaultLoop),
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
      <Content
        stage={audioData.stage}
        src={audioData.src}
        list={audioData.list.map(({ file, loop, duration }) => ({
          current: audioData.file === file,
          file,
          loop,
          duration,
        }))}
        repeat={audioData.repeat}
        setAudioData={setAudioData}
      />
      <AddFiles addFiles={addFiles} setAudioData={setAudioData} />
    </Wrapper>
  );
};

export default IndexPage;
