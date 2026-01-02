import { Builder, WebDriver, Capabilities } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import { Options as FirefoxOptions } from 'selenium-webdriver/firefox';
import { config } from '../config';

/**
 * Create WebDriver instance
 */
export async function createDriver(): Promise<WebDriver> {
  const browserName = config.browser.toLowerCase();

  if (browserName === 'firefox') {
    return createFirefoxDriver();
  }
  return createChromeDriver();
}

/**
 * Create Chrome WebDriver
 */
async function createChromeDriver(): Promise<WebDriver> {
  const options = new ChromeOptions();
  
  // Set Chrome binary path explicitly for WSL
  options.setChromeBinaryPath('/usr/bin/google-chrome-stable');

  // Chrome options for WSL - conservative approach
  options.addArguments(
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-setuid-sandbox'
  );

  if (config.headless) {
    options.addArguments('--headless=new');
  } else {
    options.addArguments('--window-size=1920,1080', '--start-maximized');
  }

  // Add logging for debugging
  console.log('Starting Chrome with headless:', config.headless);
  console.log('Chrome binary: /usr/bin/google-chrome-stable');
  console.log('Initializing ChromeDriver...');
  
  try {
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    console.log('✅ Chrome driver initialized successfully');

    console.log('✅ Chrome driver initialized successfully');
    
    await driver.manage().setTimeouts({
      implicit: config.implicitWait,
      pageLoad: config.pageLoadTimeout,
    });

    console.log('⏱️ Timeouts configured');

    return driver;
  } catch (error) {
    console.error('❌ Failed to initialize Chrome driver:', error);
    throw error;
  }
}

/**
 * Create Firefox WebDriver
 */
async function createFirefoxDriver(): Promise<WebDriver> {
  const options = new FirefoxOptions();

  if (config.headless) {
    options.addArguments('--headless');
  }

  options.setPreference('media.navigator.permission.disabled', true);
  options.setPreference('media.navigator.streams.fake', true);

  const driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

  await driver.manage().setTimeouts({
    implicit: config.implicitWait,
    pageLoad: config.pageLoadTimeout,
  });

  await driver.manage().window().maximize();

  return driver;
}

/**
 * Quit driver safely
 */
export async function quitDriver(driver: WebDriver | null): Promise<void> {
  if (driver) {
    try {
      await driver.quit();
    } catch (error) {
      console.error('Error quitting driver:', error);
    }
  }
}
