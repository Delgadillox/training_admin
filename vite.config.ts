// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (['js', 'css'].indexOf(hostType) !== -1) {
        return { runtime: `window.__getFile(${JSON.stringify(filename)})` };
      } else {
        return { relative: true };
      }
    },
  },
});
