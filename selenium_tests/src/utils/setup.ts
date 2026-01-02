import { WebDriver } from 'selenium-webdriver';
import { createDriver, quitDriver as quitDriverHelper } from './driver';

// Global driver instance for tests
let globalDriver: WebDriver | null = null;

/**
 * Get or create driver instance
 */
export function getDriver(): WebDriver {
  if (!globalDriver) {
    throw new Error('Driver not initialized. Call initDriver() first.');
  }
  return globalDriver;
}

/**
 * Initialize driver
 */
export async function initDriver(): Promise<WebDriver> {
  if (!globalDriver) {
    globalDriver = await createDriver();
  }
  return globalDriver;
}

/**
 * Close global driver
 */
export async function closeDriver(): Promise<void> {
  await quitDriverHelper(globalDriver);
  globalDriver = null;
}

/**
 * Quit driver - exported alias
 */
export async function quitDriver(): Promise<void> {
  await closeDriver();
}

/**
 * Jest setup - increase timeout
 */
if (typeof jest !== 'undefined') {
  jest.setTimeout(120000);
}

// Note: Each test file should call initDriver() in its own beforeAll()
// to ensure proper async initialization order
