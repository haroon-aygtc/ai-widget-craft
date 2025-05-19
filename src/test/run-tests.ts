
import { execSync } from 'child_process';

console.log('Running model utility tests...');
try {
  execSync('vitest run src/utils/models', { stdio: 'inherit' });
  console.log('Model utility tests passed!');
} catch (error) {
  console.error('Model utility tests failed');
  process.exit(1);
}

console.log('Running component tests...');
try {
  execSync('vitest run src/components/models', { stdio: 'inherit' });
  console.log('Component tests passed!');
} catch (error) {
  console.error('Component tests failed');
  process.exit(1);
}

console.log('Running hook tests...');
try {
  execSync('vitest run src/hooks', { stdio: 'inherit' });
  console.log('Hook tests passed!');
} catch (error) {
  console.error('Hook tests failed');
  process.exit(1);
}

console.log('All tests passed!');
