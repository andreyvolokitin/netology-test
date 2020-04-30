require('dotenv').config(); // https://github.com/kentcdodds/cross-env/issues/56
require('core-js/stable');
require('regenerator-runtime/runtime');

const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const loadPresets = require('./build-utils/loadPresets');
// eslint-disable-next-line import/no-dynamic-require, global-require
const modeConfig = (mode, options) => require(`./build-utils/webpack.${mode}.js`)(mode, options);
const settings = require('./build-utils/settings');

const pageNames = [];
const ignorePagesAsEntries = ['404'];

function getFiles(directoryPath) {
  let files = [];

  if (fs.existsSync(directoryPath)) {
    try {
      files = fs.readdirSync(directoryPath);
    } catch (err) {
      console.error(`Could not list the directory: ${directoryPath}`, err);
      process.exit(1);
    }
  }

  return files;
}

function excludeNodeModulesExcept(modules) {
  let pathSep = path.sep;

  if (pathSep === '\\') {
    // must be quoted for use in a regexp:
    pathSep = '\\\\';
  }

  const moduleRegExps = modules.map((modName) => new RegExp(`node_modules${pathSep}${modName}`));

  return function (modulePath) {
    if (/node_modules/.test(modulePath)) {
      for (let i = 0; i < moduleRegExps.length; i += 1) {
        if (moduleRegExps[i].test(modulePath)) {
          return false;
        }
      }
      return true;
    }
    return false;
  };
}

const srcFiles = getFiles(path.resolve(__dirname, settings.paths.src.base));
const entryFiles = getFiles(
  path.resolve(__dirname, settings.paths.src.base, settings.paths.src.pages)
);

srcFiles.forEach((file) => {
  const parsedPath = path.parse(file);

  if (parsedPath.ext === '.html' && !ignorePagesAsEntries.includes(parsedPath.name)) {
    pageNames.push(parsedPath.name);
  }
});

function getConfigObject(mode, buildType) {
  const entries = {};

  process.env.BABEL_ENV = mode;

  entryFiles.forEach((file) => {
    const parsedPath = path.parse(file);

    // pageNames.push(parsedPath.name);
    entries[parsedPath.name] = [
      `${settings.paths.src.js}/vendor/polyfills.js`,
      `${settings.paths.src.pages}/${parsedPath.name}.js`,
    ];

    if (buildType === 'legacy') {
      entries[parsedPath.name].unshift(`${settings.paths.src.js}/vendor/polyfills-legacy.js`);
    }
  });

  // "styles" entry name should be equal to the name of "css" cacheGroup, see #2 in the README.md
  entries.styles = `${settings.paths.src.js}/styles.css.js`;

  return {
    // https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a
    // https://webpack.js.org/configuration/
    mode,
    context: path.resolve(__dirname, settings.paths.src.base),
    entry: entries,
    output: {
      path: path.resolve(__dirname, settings.paths.dist.base),
    },
    resolve: {
      alias: {
        modernizr$: path.resolve(__dirname, '.modernizrrc.js'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx)$/,
          // https://github.com/babel/babel-loader/issues/171
          // https://github.com/webpack/webpack/issues/2031#issuecomment-317589620
          exclude: [excludeNodeModulesExcept(['nanoid']), /vendor/],
          // exclude: /(node_modules|vendor)/,
          use: ['babel-loader', 'eslint-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif|ttf|eot|woff|woff2)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: false,
                // limit: 5 * 1024,
                name: '[name].[hash:8].[ext]',
                outputPath(url) {
                  const p = /\.(ttf|eot|woff|woff2)$/.test(url)
                    ? path.normalize(settings.paths.dist.fonts)
                    : path.normalize(settings.paths.dist.img);

                  return path.join(p, url);
                },
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          loader: 'svg-url-loader',
          options: {
            limit: 1,
            // limit: 5 * 1024,
            // Remove quotes around the encoded URL –
            // they’re rarely useful
            noquotes: true,
            name: '[name].[hash:8].[ext]',
            outputPath: path.normalize(settings.paths.dist.img),
          },
        },
        {
          test: /\.modernizrrc\.js$/,
          use: [
            {
              loader: 'expose-loader',
              options: 'Modernizr',
            },
            {
              loader: 'webpack-modernizr-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      new webpack.ProvidePlugin({
        Modernizr: 'modernizr',
      }),
      ...pageNames.map(
        (name) =>
          new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: `./${name}.html`,
            chunks: ['runtime', 'vendor', 'commons', name, 'styles'],
            chunksSortMode: 'manual',
            minify: {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: false,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            },
          })
      ),
    ],
    optimization: {
      // for slimmer chunks:
      // - use dynamic code splitting
      // - deprecate a concept of 'vendor' chunk
      splitChunks: {
        cacheGroups: {
          css: {
            test: /\.(css|scss)$/,
            // name should be equal to the name of css-only webpack entry, see #1 in the README.md
            name: 'styles',
            chunks: 'all',
            minChunks: 1,
          },
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
          },
          vendors: {
            test: /([\\/](node_modules|vendor)[\\/]|\.modernizrrc.js$)/,
            name: 'vendor',
            chunks: 'initial',
          },
        },
      },
      // consider inlining runtime chunk into html
      runtimeChunk: 'single',
    },
  };
}

module.exports = ({ mode = 'production', presets = [], measure = false } = {}) => {
  const smp = new SpeedMeasurePlugin({
    disable: !measure,
  });
  let config;

  function merge(buildType = 'legacy') {
    return webpackMerge(
      getConfigObject(mode, buildType),
      webpackMerge.strategy({
        'module.rules': 'replace',
      })(
        modeConfig(mode, {
          buildType,
        }),
        loadPresets({ mode, presets })
      )
    );
  }

  if (mode === 'production') {
    config = [merge('legacy'), merge('modern')];
  } else {
    config = merge('legacy');
  }

  return smp.wrap(config);
};
