import React from 'react';
import styled from 'styled-components';

const Header = styled.h1`
  margin: 0;
`;

const IndexPage = () => (
  <>
    <Header>Hi!</Header>
    <label htmlFor="files-chooser">
      Choose file(s)
      <input
        id="files-chooser"
        type="file"
        accept=".mp3,.flac,.ogg,.wav"
        multiple
      />
    </label>
  </>
);

export default IndexPage;
