// global.d.ts
declare global {
    interface Window {
      __getFile: (file: string) => string;
    }
  }
  