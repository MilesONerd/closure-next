import { ClosureNextWebpackPlugin } from '../index';
import webpack from 'webpack';
import path from 'path';
import fs from 'fs';

describe('Webpack Integration', () => {
  const outputPath = path.resolve(__dirname, 'dist');
  
  beforeEach(() => {
    // Clean up output directory
    if (fs.existsSync(outputPath)) {
      fs.rmSync(outputPath, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up output directory
    if (fs.existsSync(outputPath)) {
      fs.rmSync(outputPath, { recursive: true });
    }
  });

  test('should compile with tree shaking enabled', (done) => {
    const compiler = webpack({
      mode: 'production',
      entry: path.resolve(__dirname, 'fixtures/app.ts'),
      output: {
        path: outputPath,
        filename: 'bundle.js'
      },
      plugins: [
        new ClosureNextWebpackPlugin({
          treeShaking: true
        })
      ]
    });

    compiler.run((err, stats) => {
      expect(err).toBeNull();
      expect(stats?.hasErrors()).toBe(false);
      
      const output = fs.readFileSync(path.join(outputPath, 'bundle.js'), 'utf-8');
      expect(output).not.toContain('unused_export');
      
      done();
    });
  });

  test('should handle code splitting', (done) => {
    const compiler = webpack({
      mode: 'production',
      entry: path.resolve(__dirname, 'fixtures/app.ts'),
      output: {
        path: outputPath,
        filename: '[name].bundle.js'
      },
      plugins: [
        new ClosureNextWebpackPlugin({
          codeSplitting: true
        })
      ]
    });

    compiler.run((err, stats) => {
      expect(err).toBeNull();
      expect(stats?.hasErrors()).toBe(false);
      
      // Check for split chunks
      expect(fs.existsSync(path.join(outputPath, 'closure-next.bundle.js'))).toBe(true);
      
      done();
    });
  });

  test('should resolve custom module paths', (done) => {
    const compiler = webpack({
      mode: 'production',
      entry: path.resolve(__dirname, 'fixtures/app.ts'),
      output: {
        path: outputPath,
        filename: 'bundle.js'
      },
      plugins: [
        new ClosureNextWebpackPlugin({
          paths: {
            '@test': path.resolve(__dirname, 'fixtures')
          }
        })
      ]
    });

    compiler.run((err, stats) => {
      expect(err).toBeNull();
      expect(stats?.hasErrors()).toBe(false);
      done();
    });
  });
});
