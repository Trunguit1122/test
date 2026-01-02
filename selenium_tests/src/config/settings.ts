import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  // URLs
  baseUrl: process.env.BASE_URL || 'http://localhost:5173',
  apiUrl: process.env.API_URL || 'http://localhost:3000',

  // Browser
  browser: process.env.BROWSER || 'chrome',
  headless: process.env.HEADLESS === 'true',

  // Timeouts (ms)
  implicitWait: parseInt(process.env.IMPLICIT_WAIT || '10000'),
  explicitWait: parseInt(process.env.EXPLICIT_WAIT || '20000'),
  pageLoadTimeout: parseInt(process.env.PAGE_LOAD_TIMEOUT || '90000'),

  // Test credentials
  testUser: {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'Test@1234',
  },

  testTeacher: {
    email: process.env.TEACHER_EMAIL || 'teacher@example.com',
    password: process.env.TEACHER_PASSWORD || 'Teacher@1234',
  },

  teacher: {
    email: process.env.TEACHER_EMAIL || 'teacher@example.com',
    password: process.env.TEACHER_PASSWORD || 'Teacher@1234',
  },

  existingUserEmail: process.env.EXISTING_USER_EMAIL || 'existing@example.com',

  // Screenshot settings
  screenshotDir: path.resolve(__dirname, '../../reports/screenshots'),
};

// Export as Settings alias for compatibility
export const Settings = config;
