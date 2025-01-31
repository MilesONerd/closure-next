import sveltePreprocess from 'svelte-preprocess';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  preprocess: sveltePreprocess({
    typescript: {
      tsconfigFile: resolve(__dirname, './tsconfig.json'),
      compilerOptions: {
        module: 'esnext',
        target: 'es2020'
      }
    },
    sourceMap: true
  })
};
