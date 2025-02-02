const config = {
  presets: [
    ['@babel/preset-env', { 
      targets: { node: 'current' },
      modules: false
    }],
    '@babel/preset-typescript',
    ['@vue/babel-preset-jsx', {
      compositionAPI: true,
      injectH: true
    }]
  ],
  plugins: [
    '@babel/plugin-transform-runtime'
  ]
};

export default config;
