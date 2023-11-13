
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'output/index.js',
    format: 'es'
  },
  plugins: [
    typescript()
  ]
};