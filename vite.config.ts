import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  assetsInclude: ['**/*.JPG'],
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'panoramic-view',
      fileName: `index`,
      formats: ['es', 'cjs'],
    },
  },
  plugins: [dts()],
  server: {
    port: 3012,
  },
});
