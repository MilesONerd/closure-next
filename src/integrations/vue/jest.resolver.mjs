function resolver(request, options) {
  if (request === 'vue') {
    return options.defaultResolver('@vue/runtime-dom', options);
  }
  return options.defaultResolver(request, options);
}

export default resolver;
