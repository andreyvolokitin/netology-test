module.exports = function conf(api) {
  const presets = [['@babel/preset-env', { modules: false }], ['@babel/preset-react']];
  const plugins = [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
  ];

  api.cache(true);

  return {
    sourceMaps: true,
    presets,
    plugins,
  };
};
