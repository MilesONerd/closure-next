module.exports = (request, options) => {
  if (request === 'vue') {
    return require.resolve('@vue/runtime-dom');
  }
  return options.defaultResolver(request, options);
};
