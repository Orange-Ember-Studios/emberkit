import { spawn } from 'child_process';
import { platform } from 'os';

export async function preview(args: string[]): Promise<void> {
  console.log('👀 Previewing production build...\n');
  
  const isWindows = platform() === 'win32';
  
  const vite = spawn('vite', ['preview', ...args], {
    stdio: 'inherit',
    shell: isWindows,
  });
  
  return new Promise((resolve, reject) => {
    vite.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Preview exited with code ${code}`));
      }
    });
    
    vite.on('error', (error) => {
      reject(error);
    });
  });
}
