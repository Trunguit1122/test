import {
  WebDriver,
  WebElement,
  By,
  until,
  Key,
} from 'selenium-webdriver';
import { config } from '../config';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Base Page Object - Contains common methods for all pages
 */
export class BasePage {
  protected driver: WebDriver;
  protected timeout: number;

  constructor(driver: WebDriver) {
    this.driver = driver;
    this.timeout = config.explicitWait;
  }

  // ==================== Navigation ====================

  /**
   * Navigate to URL
   */
  async navigateTo(path: string): Promise<void> {
    const url = path.startsWith('http') ? path : `${config.baseUrl}${path}`;
    console.log(`[BasePage] Navigating to: ${url}`);
    try {
      await this.driver.get(url);
      console.log(`[BasePage] Navigation successful`);
      // Wait for page to be fully loaded
      await this.driver.wait(async () => {
        const state = await this.driver.executeScript('return document.readyState');
        return state === 'complete';
      }, 10000);
      console.log(`[BasePage] Page fully loaded`);
    } catch (error) {
      console.error(`[BasePage] Navigation failed:`, error);
      throw error;
    }
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.driver.getCurrentUrl();
  }

  /**
   * Refresh page
   */
  async refresh(): Promise<void> {
    await this.driver.navigate().refresh();
  }

  /**
   * Go back
   */
  async goBack(): Promise<void> {
    await this.driver.navigate().back();
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return this.driver.getTitle();
  }

  /**
   * Get page source HTML
   */
  async getPageSource(): Promise<string> {
    return this.driver.getPageSource();
  }

  // ==================== Element Finding ====================

  /**
   * Find element with wait
   */
  async findElement(locator: By, timeout: number = this.timeout): Promise<WebElement> {
    await this.driver.wait(until.elementLocated(locator), timeout);
    return this.driver.findElement(locator);
  }

  /**
   * Find elements
   */
  async findElements(locator: By): Promise<WebElement[]> {
    return this.driver.findElements(locator);
  }

  /**
   * Wait for element to be visible
   */
  async waitForVisible(locator: By, timeout: number = this.timeout): Promise<WebElement> {
    const element = await this.findElement(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }

  /**
   * Wait for element to be clickable
   */
  async waitForClickable(locator: By, timeout: number = this.timeout): Promise<WebElement> {
    const element = await this.waitForVisible(locator, timeout);
    await this.driver.wait(until.elementIsEnabled(element), timeout);
    return element;
  }

  /**
   * Wait for element to be invisible
   */
  async waitForInvisible(locator: By, timeout: number = this.timeout): Promise<void> {
    try {
      const element = await this.driver.findElement(locator);
      await this.driver.wait(until.elementIsNotVisible(element), timeout);
    } catch {
      // Element not found is acceptable
    }
  }

  // ==================== Element Interaction ====================

  /**
   * Click element
   */
  async click(locator: By): Promise<void> {
    const element = await this.waitForClickable(locator);
    await element.click();
  }

  /**
   * Type text into element
   */
  async type(locator: By, text: string): Promise<void> {
    const element = await this.waitForVisible(locator);
    await element.clear();
    await element.sendKeys(text);
  }

  /**
   * Clear element
   */
  async clear(locator: By): Promise<void> {
    const element = await this.waitForVisible(locator);
    await element.clear();
  }

  /**
   * Get text from element
   */
  async getText(locator: By): Promise<string> {
    const element = await this.waitForVisible(locator);
    return element.getText();
  }

  /**
   * Get attribute value
   */
  async getAttribute(locator: By, attribute: string): Promise<string | null> {
    const element = await this.findElement(locator);
    return element.getAttribute(attribute);
  }

  /**
   * Get input value
   */
  async getValue(locator: By): Promise<string> {
    return (await this.getAttribute(locator, 'value')) || '';
  }

  /**
   * Press key
   */
  async pressKey(key: string): Promise<void> {
    await this.driver.actions().sendKeys(key).perform();
  }

  /**
   * Press Enter key
   */
  async pressEnter(): Promise<void> {
    await this.pressKey(Key.ENTER);
  }

  /**
   * Press Tab key
   */
  async pressTab(): Promise<void> {
    await this.pressKey(Key.TAB);
  }

  // ==================== Element State ====================

  /**
   * Check if element is displayed
   */
  async isDisplayed(locator: By, timeout: number = 3000): Promise<boolean> {
    try {
      const element = await this.driver.wait(until.elementLocated(locator), timeout);
      return element.isDisplayed();
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(locator: By): Promise<boolean> {
    try {
      const element = await this.findElement(locator);
      return element.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Check if element is disabled
   */
  async isDisabled(locator: By): Promise<boolean> {
    return !(await this.isEnabled(locator));
  }

  /**
   * Check if element is selected
   */
  async isSelected(locator: By): Promise<boolean> {
    try {
      const element = await this.findElement(locator);
      return element.isSelected();
    } catch {
      return false;
    }
  }

  /**
   * Check if element exists
   */
  async exists(locator: By): Promise<boolean> {
    const elements = await this.driver.findElements(locator);
    return elements.length > 0;
  }

  /**
   * Get element count
   */
  async getElementCount(locator: By): Promise<number> {
    const elements = await this.findElements(locator);
    return elements.length;
  }

  // ==================== Waiting ====================

  /**
   * Wait for URL to contain text
   */
  async waitForUrlContains(text: string, timeout: number = this.timeout): Promise<void> {
    await this.driver.wait(until.urlContains(text), timeout);
  }

  /**
   * Wait for seconds
   */
  async wait(ms: number): Promise<void> {
    await this.driver.sleep(ms);
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad(timeout: number = this.timeout): Promise<void> {
    await this.driver.wait(async () => {
      const readyState = await this.driver.executeScript('return document.readyState');
      return readyState === 'complete';
    }, timeout);
  }

  // ==================== Select Dropdown ====================

  /**
   * Select option by visible text
   */
  async selectByText(locator: By, text: string): Promise<void> {
    const element = await this.waitForVisible(locator);
    const options = await element.findElements(By.tagName('option'));
    for (const option of options) {
      const optionText = await option.getText();
      if (optionText === text) {
        await option.click();
        return;
      }
    }
    throw new Error(`Option with text "${text}" not found`);
  }

  /**
   * Select option by value
   */
  async selectByValue(locator: By, value: string): Promise<void> {
    const element = await this.waitForVisible(locator);
    const options = await element.findElements(By.tagName('option'));
    for (const option of options) {
      const optionValue = await option.getAttribute('value');
      if (optionValue === value) {
        await option.click();
        return;
      }
    }
    throw new Error(`Option with value "${value}" not found`);
  }

  // ==================== Scrolling ====================

  /**
   * Scroll to element
   */
  async scrollToElement(locator: By): Promise<void> {
    const element = await this.findElement(locator);
    await this.driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center"});', element);
    await this.wait(300);
  }

  /**
   * Scroll to top
   */
  async scrollToTop(): Promise<void> {
    await this.driver.executeScript('window.scrollTo(0, 0);');
  }

  /**
   * Scroll to bottom
   */
  async scrollToBottom(): Promise<void> {
    await this.driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
  }

  // ==================== File Upload ====================

  /**
   * Upload file
   */
  async uploadFile(locator: By, filePath: string): Promise<void> {
    const absolutePath = path.resolve(filePath);
    const element = await this.findElement(locator);
    await element.sendKeys(absolutePath);
  }

  // ==================== Screenshot ====================

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<string> {
    const screenshot = await this.driver.takeScreenshot();
    const dir = config.screenshotDir;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const fileName = `${name}_${Date.now()}.png`;
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, screenshot, 'base64');
    return filePath;
  }

  // ==================== JavaScript Execution ====================

  /**
   * Execute JavaScript
   */
  async executeScript<T>(script: string, ...args: unknown[]): Promise<T> {
    return this.driver.executeScript(script, ...args) as Promise<T>;
  }

  /**
   * Clear localStorage and sessionStorage
   */
  async clearStorage(): Promise<void> {
    await this.driver.executeScript('localStorage.clear(); sessionStorage.clear();');
  }

  /**
   * Clear cookies
   */
  async clearCookies(): Promise<void> {
    await this.driver.manage().deleteAllCookies();
  }

  /**
   * Clear all browser data (cookies + storage)
   */
  async clearBrowserData(): Promise<void> {
    await this.clearCookies();
    await this.clearStorage();
  }

  /**
   * Click with JavaScript
   */
  async jsClick(locator: By): Promise<void> {
    const element = await this.findElement(locator);
    await this.driver.executeScript('arguments[0].click();', element);
  }

  /**
   * Type with JavaScript
   */
  async jsType(locator: By, text: string): Promise<void> {
    const element = await this.findElement(locator);
    await this.driver.executeScript(`arguments[0].value = '${text}';`, element);
    await this.driver.executeScript(
      "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
      element
    );
  }

  // ==================== Alerts ====================

  /**
   * Accept alert
   */
  async acceptAlert(): Promise<void> {
    const alert = await this.driver.switchTo().alert();
    await alert.accept();
  }

  /**
   * Dismiss alert
   */
  async dismissAlert(): Promise<void> {
    const alert = await this.driver.switchTo().alert();
    await alert.dismiss();
  }

  /**
   * Get alert text
   */
  async getAlertText(): Promise<string> {
    const alert = await this.driver.switchTo().alert();
    return alert.getText();
  }

  // ==================== Frames ====================

  /**
   * Switch to frame
   */
  async switchToFrame(locator: By): Promise<void> {
    const element = await this.findElement(locator);
    await this.driver.switchTo().frame(element);
  }

  /**
   * Switch to default content
   */
  async switchToDefaultContent(): Promise<void> {
    await this.driver.switchTo().defaultContent();
  }

  // ==================== Window/Tab ====================

  /**
   * Get window handles
   */
  async getWindowHandles(): Promise<string[]> {
    return this.driver.getAllWindowHandles();
  }

  /**
   * Switch to window
   */
  async switchToWindow(handle: string): Promise<void> {
    await this.driver.switchTo().window(handle);
  }

  /**
   * Close current window
   */
  async closeWindow(): Promise<void> {
    await this.driver.close();
  }
}
