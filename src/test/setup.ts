
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';
import { mockFetch } from 'vi-fetch';

// Make vi global
window.vi = vi;

// Extend Vitest's expect with Testing Library's matchers
expect.extend(matchers);

// Reset any mocks and cleanup after each test
afterEach(() => {
  cleanup();
  mockFetch.reset();
});
