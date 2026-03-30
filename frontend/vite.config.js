import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Un solo `.env` en la raíz del monorepo (misma carpeta que docker-compose.yml). */
const rootDir = path.resolve(__dirname, '..');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '');
  const apiTarget =
    env.API_PROXY_TARGET ||
    process.env.API_PROXY_TARGET ||
    'http://localhost:3000';

  return {
    plugins: [react()],
    envDir: rootDir,
    server: {
      port: Number(env.FRONTEND_DEV_PORT) || 5173,
      host: true,
      proxy: {
        '/auth': { target: apiTarget, changeOrigin: true },
        '/product': { target: apiTarget, changeOrigin: true },
        '/user': { target: apiTarget, changeOrigin: true },
        '/events': { target: apiTarget, changeOrigin: true },
      },
    },
  };
});
