// TODO Provide captions for media - https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/media-has-caption.md

import React, { useState } from 'react';
import styled from 'styled-components';

const Header = styled.h1`
  margin: 0;
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
  const [src, setSrc] = useState(undefined);
  const onChange = async (event) => {
    const target = event.currentTarget;
    if (target.files && target.files[0]) {
      const data = await readFile(target.files[0]);
      setSrc(data);
    }
  };

  return (
    <>
      <Header>Hi!</Header>
      <label htmlFor="files-chooser">
        Choose file(s)
        <input
          id="files-chooser"
          type="file"
          accept=".mp3,.flac,.ogg,.wav"
          multiple
          onChange={onChange}
        />
      </label>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      {src && <audio controls autoPlay src={src} />}
    </>
  );
};

export default IndexPage;
