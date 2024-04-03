import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }: { mode: string }) => {
  const isProduction = mode === 'production';
  const base = isProduction ? '/admin/' : '';

  return defineConfig({
    base: base,
    plugins: [react()]
  });
};
