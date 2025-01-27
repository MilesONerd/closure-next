module.exports = {
  presets: [
    ['@babel/preset-env', { 
      targets: { node: 'current' },
      modules: 'commonjs'
    }],
    '@babel/preset-typescript'
  ],
  env: {
    test: {
      plugins: [
        '@vue/babel-plugin-jsx',
        '@babel/plugin-transform-modules-commonjs'
      ]
    }
  }
};
