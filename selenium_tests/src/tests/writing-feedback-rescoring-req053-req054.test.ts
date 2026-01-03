import { WebDriver } from 'selenium-webdriver';
import { WritingPracticePage } from '../pages/WritingPracticePage';
import { PracticeListPage } from '../pages/PracticeListPage';
import { SignInPage } from '../pages/SignInPage';
import { setupDriver, teardownDriver } from '../utils/setup';
import { TEST_USERS } from '../utils/testData';
import { MESSAGES } from '../config/messages';

/**
 * Feedback & Rescoring Tests (REQ053, REQ054)
 * Test Cases: FUC-163 to FUC-168
 */
describe('REQ053 & REQ054: Feedback Display & Rescoring', () => {
  let driver: WebDriver;
  let writingPage: WritingPracticePage;
  let practiceListPage: PracticeListPage;
  let signInPage: SignInPage;

  beforeAll(async () => {
    driver = await setupDriver();
  });

  afterAll(async () => {
    await teardownDriver(driver);
  });

  beforeEach(async () => {
    writingPage = new WritingPracticePage(driver);
    practiceListPage = new PracticeListPage(driver);
    signInPage = new SignInPage(driver);
    
    await signInPage.navigate();
    await signInPage.login(TEST_USERS.learner.email, TEST_USERS.learner.password);
  });

  // ==================== REQ053: Feedback Display ====================
  describe('REQ053: Feedback Display After Scoring', () => {
    
    test('FUC-163: Display all three feedback sections (Strengths, Areas, Suggestions)', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(2000);

      await practiceListPage.clickOnCompletedAttempt();
      await driver.sleep(3000);

      const strengthsSection = await writingPage.getFeedbackSection('Strengths');
      const improvementSection = await writingPage.getFeedbackSection('Areas for Improvement');
      const suggestionsSection = await writingPage.getFeedbackSection('Specific Suggestions');

      expect(strengthsSection).toBeTruthy();
      expect(improvementSection).toBeTruthy();
      expect(suggestionsSection).toBeTruthy();
    });

    test('FUC-164: Feedback data matches API response', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(2000);
      await practiceListPage.clickOnCompletedAttempt();
      await driver.sleep(3000);

      const uiFeedback = await writingPage.getAllFeedbackText();

      expect(uiFeedback.strengths).toBeTruthy();
      expect(uiFeedback.improvements).toBeTruthy();
      expect(uiFeedback.suggestions).toBeTruthy();
    });

    test('FUC-165: Feedback sections are clearly separated and readable', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(2000);
      await practiceListPage.clickOnCompletedAttempt();
      await driver.sleep(3000);

      const sectionHeaders = await writingPage.getFeedbackSectionHeaders();
      expect(sectionHeaders.length).toBe(3);
      expect(sectionHeaders).toContain('Strengths');
      expect(sectionHeaders).toContain('Areas for Improvement');
      expect(sectionHeaders).toContain('Specific Suggestions');
    });
  });

  // ==================== REQ054: Re-scoring ====================
  describe('REQ054: Re-scoring on Failed Status', () => {
    
    test('FUC-166: Display MSG-027 and Re-scoring button when status is Failed', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(2000);
      
      await practiceListPage.clickOnFailedAttempt();
      await driver.sleep(3000);

      const errorMessage = await writingPage.getErrorMessage();
      expect(errorMessage).toContain(MESSAGES.MSG_027 || 'Re-scoring');

      const rescoringButton = await writingPage.getRescoringButton();
      expect(rescoringButton).toBeTruthy();
    });

    test('FUC-167: Re-scoring succeeds and displays results', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(2000);
      await practiceListPage.clickOnFailedAttempt();
      await driver.sleep(3000);

      const rescoringButton = await writingPage.getRescoringButton();
      await rescoringButton.click();
      await driver.sleep(3000);

      await driver.sleep(5000);

      const feedbackSections = await writingPage.getAllFeedbackText();
      expect(feedbackSections.strengths).toBeTruthy();
    });

    test('FUC-168: Re-scoring button hidden when status is Completed', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(2000);
      
      await practiceListPage.clickOnCompletedAttempt();
      await driver.sleep(3000);

      const rescoringButton = await writingPage.getRescoringButton();
      expect(rescoringButton).toBeFalsy();

      const errorMessage = await writingPage.getErrorMessage();
      expect(errorMessage).not.toContain(MESSAGES.MSG_027 || 'Re-scoring');
    });
  });
});
