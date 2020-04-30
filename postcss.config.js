/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const settings = require('./build-utils/settings');

const assetsSrc = path.normalize(settings.paths.src.assets);

// eslint-disable-next-line no-unused-vars
module.exports = ({ file, options, env }) => ({
  plugins: {
    // URLs in CSS are relative to the project source folder (src).
    // This plugin rewrites sourceFolder-relative URLs to be file-relative and actually resolvable
    'postcss-urlrewrite': {
      rules: [
        {
          from: new RegExp(`^(./)?${assetsSrc}/.+`),
          to: `${path
            .normalize(settings.paths.src.css)
            .split(path.sep)
            .reduce((accumulator, val) => {
              return /\w+/.test(val) ? `${accumulator}../` : accumulator;
            }, '')}$&`,
        },
      ],
    },
    'postcss-easing-gradients': {},
    'postcss-inline-svg': {},
    'postcss-at2x': {
      detectImageSize: true,
      resolveImagePath(url) {
        return path.resolve(settings.paths.src.base, settings.paths.src.css, url);
      },
    },
    'postcss-flexbugs-fixes': {},
    autoprefixer: {},
    // https://stackoverflow.com/a/22262489/718630
    // https://adamwathan.me/dont-use-em-for-media-queries/
    'postcss-em-media-query': {},
    'postcss-reporter': {},
  },
});
