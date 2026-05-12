import { spawn } from 'child_process';
import { platform } from 'os';

export async function build(args: string[]): Promise<void> {
  console.log('🔨 Building for production...\n');
  
  const isWindows = platform() === 'win32';
  
  const vite = spawn('vite', ['build', ...args], {
    stdio: 'inherit',
    shell: isWindows,
  });
  
  return new Promise((resolve, reject) => {
    vite.on('exit', (code) => {
      if (code === 0) {
        console.log('\n✨ Build complete!');
        resolve();
      } else {
        reject(new Error(`Build failed with code ${code}`));
      }
    });
    
    vite.on('error', (error) => {
      reject(error);
    });
  });
}
