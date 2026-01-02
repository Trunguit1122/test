import { Builder, By, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

async function debugLogin() {
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  options.setBinaryPath('/usr/bin/google-chrome-stable');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    console.log('1. Opening signin page...');
    await driver.get('http://localhost:3001/signin');
    
    // Wait for page load
    await driver.wait(async () => {
      const state = await driver.executeScript('return document.readyState');
      return state === 'complete';
    }, 10000);
    
    console.log('2. Page loaded, testing STUDENT login...');
    
    // Try to find email input
    const emailInput = await driver.findElement(By.css('input#email'));
    console.log('3. Found email input');
    
    // Type email - use Mock FE email
    await emailInput.sendKeys('student1@lingolab.com');
    console.log('4. Typed student email');
    
    const passwordInput = await driver.findElement(By.css('input#password'));
    await passwordInput.sendKeys('Password123!');
    console.log('5. Typed password');
    
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
    console.log('6. Clicked submit');
    
    // Wait and check URL
    await driver.sleep(3000);
    const url = await driver.getCurrentUrl();
    console.log('7. Current URL after STUDENT login:', url);
    console.log('   Expected: contains /student');
    
    // Check for toast
    try {
      const toast = await driver.findElement(By.css('[data-sonner-toast]'));
      const toastText = await toast.getText();
      console.log('8. Toast message:', toastText);
    } catch {
      console.log('8. No toast found');
    }
    
    console.log('\n=== SUCCESS: Student login redirected to', url, '===\n');
    
  } catch (e) {
    console.log('Error:', e);
  } finally {
    await driver.quit();
  }
}

debugLogin().catch(console.error);
