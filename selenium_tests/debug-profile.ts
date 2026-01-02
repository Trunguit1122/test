import { Builder, By } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

async function testProfileAccess() {
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
    console.log('1. Login with student...');
    await driver.get('http://localhost:3001/signin');
    await driver.wait(async () => {
      const state = await driver.executeScript('return document.readyState');
      return state === 'complete';
    }, 10000);
    
    const emailInput = await driver.findElement(By.css('input#email'));
    await emailInput.sendKeys('student1@lingolab.com');
    
    const passwordInput = await driver.findElement(By.css('input#password'));
    await passwordInput.sendKeys('Password123!');
    
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
    
    await driver.sleep(3000);
    let url = await driver.getCurrentUrl();
    console.log('2. URL after login:', url);
    
    console.log('3. Navigating to profile...');
    await driver.get('http://localhost:3001/student/profile');
    await driver.sleep(2000);
    
    url = await driver.getCurrentUrl();
    console.log('4. Profile page URL:', url);
    
    // Check if inputs exist
    try {
      const firstName = await driver.findElement(
        By.xpath('//label[contains(text(), "First Name")]/following-sibling::input')
      );
      console.log('5. ✅ Found First Name input');
      
      const lastName = await driver.findElement(
        By.xpath('//label[contains(text(), "Last Name")]/following-sibling::input')
      );
      console.log('6. ✅ Found Last Name input');
      
      const saveBtn = await driver.findElement(
        By.xpath('//button[contains(text(), "Save Changes")]')
      );
      console.log('7. ✅ Found Save button');
      
    } catch (e) {
      const error = e as Error;
      console.log('❌ Error finding elements:', error.message);
      const pageSource = await driver.getPageSource();
      console.log('Page has "First Name":', pageSource.includes('First Name'));
    }
    
  } finally {
    await driver.quit();
  }
}

testProfileAccess().catch(console.error);
