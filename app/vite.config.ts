import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; 

// https://vitejs.dev/config/
 

export default ({ mode }) => {
  // In-case the frontend port needs to be changed at some point:
  // Load app-level env vars to node-level env vars.
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  
  const port : number = +(process.env.VITE_PORT || 8080);

  return defineConfig({
    plugins: [react()],
    server: {
      host: true,
      port: port,
    },
  })
}
