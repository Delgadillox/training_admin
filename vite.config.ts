import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }: { mode: string }) => {

  return defineConfig({
    base: '/admin/',
    plugins: [react()]
  });
};
