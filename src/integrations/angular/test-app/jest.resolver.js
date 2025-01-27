module.exports = (path, options) => {
  // Special handling for @angular/core/testing
  if (path === '@angular/core/testing') {
    return require.resolve('@angular/core/testing/index.js', {
      paths: [options.basedir]
    });
  }

  // Call the default resolver
  return options.defaultResolver(path, {
    ...options,
    // Handle both ESM and CommonJS
    packageFilter: pkg => {
      if (path.endsWith('.js') || path.endsWith('.ts')) {
        // Keep ESM for our source files
        return pkg;
      }
      // Force CommonJS for node_modules
      if (pkg.type === 'module') {
        delete pkg.exports;
        delete pkg.type;
        pkg.main = pkg.main || 'index.js';
      }
      return pkg;
    },
  });
};
