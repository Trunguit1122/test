import { WebDriver } from 'selenium-webdriver';
import { PracticeHistoryPage } from '../pages/PracticeHistoryPage';
import { SignInPage } from '../pages/SignInPage';
import { setupDriver, teardownDriver } from '../utils/setup';
import { TEST_USERS } from '../utils/testData';
import { MESSAGES } from '../config/messages';

/**
 * Practice History Management Tests (REQ055, REQ056, REQ057)
 * Test Cases: FUC-169 to FUC-179
 */
describe('REQ055-REQ057: Practice History Management', () => {
  let driver: WebDriver;
  let practiceHistoryPage: PracticeHistoryPage;
  let signInPage: SignInPage;

  beforeAll(async () => {
    driver = await setupDriver();
  });

  afterAll(async () => {
    await teardownDriver(driver);
  });

  beforeEach(async () => {
    practiceHistoryPage = new PracticeHistoryPage(driver);
    signInPage = new SignInPage(driver);
    
    await signInPage.navigate();
    await signInPage.login(TEST_USERS.learner.email, TEST_USERS.learner.password);
  });

  // ==================== REQ055: Sorting ====================
  describe('REQ055: Practice History Sorting', () => {
    
    test('FUC-169: History displays in descending order by date (most recent first)', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const attempts = await practiceHistoryPage.getAttemptsList();
      
      for (let i = 0; i < attempts.length - 1; i++) {
        const currentDate = new Date(attempts[i].date);
        const nextDate = new Date(attempts[i + 1].date);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });

    test('FUC-170: Same-day attempts sorted by timestamp (newest first)', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const sameDayAttempts = await practiceHistoryPage.getAttemptsFromSameDay();
      
      for (let i = 0; i < sameDayAttempts.length - 1; i++) {
        const currentTime = new Date(sameDayAttempts[i].timestamp).getTime();
        const nextTime = new Date(sameDayAttempts[i + 1].timestamp).getTime();
        expect(currentTime).toBeGreaterThanOrEqual(nextTime);
      }
    });

    test('FUC-171: Single attempt displays correctly', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const attempts = await practiceHistoryPage.getAttemptsList();
      if (attempts.length === 1) {
        expect(attempts[0]).toBeTruthy();
      }
    });
  });

  // ==================== REQ056: Filtering ====================
  describe('REQ056: Practice History Filtering', () => {
    
    test('FUC-172: Filter by Skill (Speaking/Writing)', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      await practiceHistoryPage.filterBySkill('Speaking');
      await driver.sleep(2000);

      let attempts = await practiceHistoryPage.getAttemptsList();
      attempts.forEach(attempt => {
        expect(attempt.skill).toBe('Speaking');
      });

      await practiceHistoryPage.filterBySkill('Writing');
      await driver.sleep(2000);

      attempts = await practiceHistoryPage.getAttemptsList();
      attempts.forEach(attempt => {
        expect(attempt.skill).toBe('Writing');
      });
    });

    test('FUC-173: Filter by Date Range', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      await practiceHistoryPage.filterByDateRange(startDate, new Date());
      await driver.sleep(2000);

      const attempts = await practiceHistoryPage.getAttemptsList();
      attempts.forEach(attempt => {
        const attemptDate = new Date(attempt.date);
        expect(attemptDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
        expect(attemptDate.getTime()).toBeLessThanOrEqual(new Date().getTime());
      });
    });

    test('FUC-174: Filter by Score Range', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      await practiceHistoryPage.filterByScoreRange(7.0, 9.0);
      await driver.sleep(2000);

      const attempts = await practiceHistoryPage.getAttemptsList();
      attempts.forEach(attempt => {
        expect(attempt.score).toBeGreaterThanOrEqual(7.0);
        expect(attempt.score).toBeLessThanOrEqual(9.0);
      });
    });

    test('FUC-175: Multiple filters applied simultaneously', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      await practiceHistoryPage.filterBySkill('Writing');
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      await practiceHistoryPage.filterByDateRange(startDate, new Date());
      
      await practiceHistoryPage.filterByScoreRange(6.0, 8.5);
      await driver.sleep(2000);

      const attempts = await practiceHistoryPage.getAttemptsList();
      attempts.forEach(attempt => {
        expect(attempt.skill).toBe('Writing');
        expect(attempt.score).toBeGreaterThanOrEqual(6.0);
        expect(attempt.score).toBeLessThanOrEqual(8.5);
      });
    });
  });

  // ==================== REQ057: Pagination ====================
  describe('REQ057: Practice History Pagination', () => {
    
    test('FUC-176: Display exactly 10 items per page', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const attempts = await practiceHistoryPage.getAttemptsList();
      
      if (attempts.length > 10) {
        expect(attempts.length).toBe(10);
      } else {
        expect(attempts.length).toBeLessThanOrEqual(10);
      }
    });

    test('FUC-177: Navigate between pages', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const hasNextButton = await practiceHistoryPage.hasNextPageButton();
      
      if (hasNextButton) {
        await practiceHistoryPage.clickNextPage();
        await driver.sleep(2000);

        const page2Attempts = await practiceHistoryPage.getAttemptsList();
        expect(page2Attempts.length).toBeGreaterThan(0);

        await practiceHistoryPage.clickPreviousPage();
        await driver.sleep(2000);

        const page1Attempts = await practiceHistoryPage.getAttemptsList();
        expect(page1Attempts.length).toBeGreaterThan(0);
      }
    });

    test('FUC-178: Hide pagination when <= 10 attempts', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const attempts = await practiceHistoryPage.getAttemptsList();
      
      if (attempts.length <= 10) {
        const paginationVisible = await practiceHistoryPage.isPaginationVisible();
        expect(paginationVisible).toBe(false);
      }
    });

    test('FUC-179: Reset to page 1 when applying filter', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const hasNextButton = await practiceHistoryPage.hasNextPageButton();
      if (hasNextButton) {
        await practiceHistoryPage.clickNextPage();
        await driver.sleep(2000);

        await practiceHistoryPage.filterBySkill('Speaking');
        await driver.sleep(2000);

        const pageNumber = await practiceHistoryPage.getCurrentPageNumber();
        expect(pageNumber).toBe(1);
      }
    });
  });
});
