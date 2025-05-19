
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { mockFetch } from 'vi-fetch';

// Extend Vitest's expect with Testing Library's matchers
expect.extend(matchers);

// Make vi available globally
// @ts-ignore - Explicitly setting vi on window
window.vi = vi;

// Reset any mocks and cleanup after each test
afterEach(() => {
  cleanup();
  mockFetch.reset();
});
