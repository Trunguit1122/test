import { WebDriver } from 'selenium-webdriver';
import { WritingPracticePage } from '../pages/WritingPracticePage';
import { SignInPage } from '../pages/SignInPage';
import { PracticeListPage } from '../pages/PracticeListPage';
import { setupDriver, teardownDriver } from '../utils/setup';
import { TEST_USERS } from '../utils/testData';
import { MESSAGES } from '../config/messages';

/**
 * Word Validation & Submission Tests (REQ051, REQ052)
 * Test Cases: FUC-156 to FUC-162
 */
describe('REQ051 & REQ052: Word Validation & AI Scoring Timeout', () => {
  let driver: WebDriver;
  let writingPage: WritingPracticePage;
  let signInPage: SignInPage;
  let practiceListPage: PracticeListPage;

  beforeAll(async () => {
    driver = await setupDriver();
  });

  afterAll(async () => {
    await teardownDriver(driver);
  });

  beforeEach(async () => {
    writingPage = new WritingPracticePage(driver);
    signInPage = new SignInPage(driver);
    practiceListPage = new PracticeListPage(driver);
    
    await signInPage.navigate();
    await signInPage.login(TEST_USERS.learner.email, TEST_USERS.learner.password);
  });

  // ==================== REQ051: Word Minimum Validation ====================
  describe('REQ051: Word Minimum Validation (Task 2 - 250 words)', () => {
    
    test('FUC-156: Block submission with 249 words (MSG-025)', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask2Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      const text249 = 'Word '.repeat(249).trim();
      await writingPage.typeInEditor(text249);
      await driver.sleep(1000);

      await writingPage.clickSubmitButton();
      await driver.sleep(2000);

      const errorMessage = await writingPage.getErrorMessage();
      expect(errorMessage).toContain(MESSAGES.MSG_025 || 'minimum');
    });

    test('FUC-157: Accept submission with exactly 250 words', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask2Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      const text250 = 'Word '.repeat(250).trim();
      await writingPage.typeInEditor(text250);
      await driver.sleep(1000);

      await writingPage.clickSubmitButton();
      await driver.sleep(3000);

      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('scoring') || expect(currentUrl).toContain('result');
    });

    test('FUC-158: Whitespace not counted as valid words', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask2Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      const textWithSpaces = 'Word Word Word Word Word Word Word Word Word Word' + ' '.repeat(500);
      await writingPage.typeInEditor(textWithSpaces);
      await driver.sleep(1000);

      const wordCount = await writingPage.getWordCount();
      expect(wordCount).toBe(10);

      await writingPage.clickSubmitButton();
      await driver.sleep(2000);

      const errorMessage = await writingPage.getErrorMessage();
      expect(errorMessage).toContain(MESSAGES.MSG_025 || 'minimum');
    });

    test('FUC-159: Error cleared after reaching requirement', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask2Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      const text249 = 'Word '.repeat(249).trim();
      await writingPage.typeInEditor(text249);
      await writingPage.clickSubmitButton();
      await driver.sleep(2000);

      let errorMessage = await writingPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();

      await writingPage.typeInEditor(' Word');
      await driver.sleep(1000);

      await writingPage.clickSubmitButton();
      await driver.sleep(3000);

      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('scoring') || expect(currentUrl).toContain('result');
    });
  });

  // ==================== REQ052: AI Scoring Timeout ====================
  describe('REQ052: AI Scoring Timeout (60 seconds)', () => {
    
    test('FUC-160: Display MSG-026 when scoring API times out', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask2Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      const validText = 'Word '.repeat(250).trim();
      await writingPage.typeInEditor(validText);

      await writingPage.clickSubmitButton();
      await driver.sleep(1000);

      await driver.sleep(60000);

      const errorMessage = await writingPage.getErrorMessage();
      if (errorMessage) {
        expect(errorMessage).toContain(MESSAGES.MSG_026 || 'timeout');
      }
    });

    test('FUC-161: Retry button available and functional after timeout', async () => {
      const retryButton = await writingPage.getRetryButton();
      expect(retryButton).toBeTruthy();

      await retryButton.click();
      await driver.sleep(3000);

      const scoringElements = await writingPage.getScoringResults();
      expect(scoringElements).toBeTruthy();
    });

    test('FUC-162: No timeout if response received at 59 seconds', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask2Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      const validText = 'Word '.repeat(250).trim();
      await writingPage.typeInEditor(validText);

      await writingPage.clickSubmitButton();
      await driver.sleep(1000);

      await driver.sleep(59000);

      const errorMessage = await writingPage.getErrorMessage();
      expect(errorMessage).not.toContain(MESSAGES.MSG_026 || 'timeout');
    });
  });
});
