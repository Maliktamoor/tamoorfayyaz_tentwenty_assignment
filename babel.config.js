module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['.'],
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@constants': './src/constants',
          '@screens': './src/screens',
          '@utilities': './src/utilities',
          '@navigation': './src/navigation',
          '@core_ui': './src/core_ui',
          '@config': './src/config',
        },
      },
    ],
  ],
};
