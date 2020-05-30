import React from 'react';
import { Helmet } from 'react-helmet';

/* eslint-disable react/prop-types */
const wrapPageElement = ({ element }) => (
  <>
    <Helmet defer={false} htmlAttributes={{ lang: 'en' }} title="Music player">
      <meta charSet="utf-8" />
      <meta name="description" content="Music player" />
    </Helmet>
    {element}
  </>
);

export default wrapPageElement;
