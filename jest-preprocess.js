// https://www.gatsbyjs.org/docs/unit-testing/

const babelOptions = {
  presets: ['babel-preset-gatsby'],
};

// eslint-disable-next-line import/no-extraneous-dependencies
module.exports = require('babel-jest').createTransformer(babelOptions);
