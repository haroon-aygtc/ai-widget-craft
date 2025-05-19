
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { resetFetch, MockFetch } from 'vi-fetch';

// Extend Vitest's expect with Testing Library's matchers
expect.extend(matchers);

// Reset any mocks and cleanup after each test
afterEach(() => {
  cleanup();
  resetFetch();
});
