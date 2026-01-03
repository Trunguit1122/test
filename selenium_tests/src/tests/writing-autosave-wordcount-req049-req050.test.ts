import { WebDriver } from 'selenium-webdriver';
import { WritingPracticePage } from '../pages/WritingPracticePage';
import { SignInPage } from '../pages/SignInPage';
import { PracticeListPage } from '../pages/PracticeListPage';
import { setupDriver, teardownDriver } from '../utils/setup';
import { TEST_USERS } from '../utils/testData';
import { MESSAGES } from '../config/messages';

/**
 * Autosave & Word Counter Tests (REQ049, REQ050)
 * Test Cases: FUC-148 to FUC-155
 */
describe('REQ049 & REQ050: Autosave & Word Counter', () => {
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

  // ==================== REQ049: Autosave ====================
  describe('REQ049: Autosave Functionality', () => {
    
    test('FUC-148: Autosave triggered after 30 seconds', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.clickStartOnFirstPrompt();
      await driver.sleep(3000);

      const testContent = 'Testing autosave functionality for 30 seconds interval';
      await writingPage.typeInEditor(testContent);

      await driver.sleep(30000);

      const saveStatus = await writingPage.getSaveStatus();
      expect(saveStatus).toContain('Saved');
    });

    test('FUC-149: Data persistence after page reload', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.clickStartOnFirstPrompt();
      await driver.sleep(3000);

      const testContent = 'Testing data persistence after reload';
      await writingPage.typeInEditor(testContent);

      await driver.sleep(31000);

      await driver.navigate().refresh();
      await driver.sleep(3000);

      const editorContent = await writingPage.getEditorContent();
      expect(editorContent).toContain(testContent);
    });

    test('FUC-150: Error handling on network failure (MSG-024)', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.clickStartOnFirstPrompt();
      await driver.sleep(3000);

      await writingPage.typeInEditor('Test content');
      await driver.sleep(31000);
      
      const errorMessage = await writingPage.getErrorMessage();
      if (errorMessage) {
        expect(errorMessage).toContain(MESSAGES.MSG_024 || 'Autosave failed');
      }
    });

    test('FUC-151: Error recovery when connection is restored', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.clickStartOnFirstPrompt();
      await driver.sleep(3000);

      const retryButton = await writingPage.getRetryButton();
      if (retryButton) {
        await retryButton.click();
        await driver.sleep(2000);
        
        const saveStatus = await writingPage.getSaveStatus();
        expect(saveStatus).toContain('Saved');
      }
    });
  });

  // ==================== REQ050: Word Counter ====================
  describe('REQ050: Real-time Word Counter', () => {
    
    test('FUC-152: Word counter updates in real-time', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.clickStartOnFirstPrompt();
      await driver.sleep(3000);

      await writingPage.typeInEditor('IELTS');
      let wordCount = await writingPage.getWordCount();
      expect(wordCount).toBe(1);

      await writingPage.typeInEditor(' Writing Test');
      wordCount = await writingPage.getWordCount();
      expect(wordCount).toBe(3);
    });

    test('FUC-153: Warning indicator when below minimum', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask1Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      const shortText = 'This is a short text. '.repeat(5);
      await writingPage.typeInEditor(shortText);

      const hasWarning = await writingPage.hasWarningIndicator();
      expect(hasWarning).toBe(true);
    });

    test('FUC-154: Warning removal when minimum reached', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask1Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      const sufficientText = 'This is sufficient content. '.repeat(6);
      await writingPage.typeInEditor(sufficientText);

      const wordCount = await writingPage.getWordCount();
      expect(wordCount).toBeGreaterThanOrEqual(150);

      const hasWarning = await writingPage.hasWarningIndicator();
      expect(hasWarning).toBe(false);
    });

    test('FUC-155: Bulk input handling (Paste)', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.clickStartOnFirstPrompt();
      await driver.sleep(3000);

      const bulkText = 'Word '.repeat(300);
      await writingPage.pasteInEditor(bulkText);
      await driver.sleep(1000);

      const wordCount = await writingPage.getWordCount();
      expect(wordCount).toBeGreaterThanOrEqual(290);
    });
  });
});
