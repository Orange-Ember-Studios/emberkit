import { spawn } from 'child_process';
import { platform } from 'os';

export async function dev(args: string[]): Promise<void> {
  console.log('🔥 Starting EmberKit dev server...\n');
  
  const isWindows = platform() === 'win32';
  
  const vite = spawn('vite', args, {
    stdio: 'inherit',
    shell: isWindows,
  });
  
  return new Promise((resolve, reject) => {
    vite.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Vite exited with code ${code}`));
      }
    });
    
    vite.on('error', (error) => {
      reject(error);
    });
  });
}
