import { WebDriver } from 'selenium-webdriver';
import { PracticeHistoryPage } from '../pages/PracticeHistoryPage';
import { SignInPage } from '../pages/SignInPage';
import { setupDriver, teardownDriver } from '../utils/setup';
import { TEST_USERS } from '../utils/testData';
import { MESSAGES } from '../config/messages';

/**
 * Attempt Comparison & Charts Tests (REQ058, REQ059, REQ060, REQ061, REQ062)
 * Test Cases: FUC-180 to FUC-197
 */
describe('REQ058-REQ062: Attempt Comparison & Analytics', () => {
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

  // ==================== REQ058-REQ060: Comparison Validation ====================
  describe('REQ058-REQ060: Attempt Comparison Validation', () => {
    
    test('FUC-180: Block comparison with only 1 attempt (MSG-028)', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      await practiceHistoryPage.selectAttempt(0);
      await driver.sleep(1000);

      await practiceHistoryPage.clickCompareButton();
      await driver.sleep(2000);

      const errorMessage = await practiceHistoryPage.getErrorMessage();
      expect(errorMessage).toContain(MESSAGES.MSG_028 || 'at least 2');
    });

    test('FUC-181: Enable compare button with 2 same-skill attempts', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(2);
      
      await practiceHistoryPage.selectAttempt(writingAttempts[0]);
      await practiceHistoryPage.selectAttempt(writingAttempts[1]);
      await driver.sleep(1000);

      const isCompareEnabled = await practiceHistoryPage.isCompareButtonEnabled();
      expect(isCompareEnabled).toBe(true);

      await practiceHistoryPage.clickCompareButton();
      await driver.sleep(3000);

      const comparisonView = await practiceHistoryPage.getComparisonView();
      expect(comparisonView).toBeTruthy();
    });

    test('FUC-182: Disable compare when selection drops below 2', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(2);
      
      await practiceHistoryPage.selectAttempt(writingAttempts[0]);
      await practiceHistoryPage.selectAttempt(writingAttempts[1]);
      await driver.sleep(1000);

      await practiceHistoryPage.unselectAttempt(writingAttempts[1]);
      await driver.sleep(1000);

      const isCompareEnabled = await practiceHistoryPage.isCompareButtonEnabled();
      expect(isCompareEnabled).toBe(false);
    });

    test('FUC-183: Handle more than 2 attempts if allowed', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(3);
      
      await practiceHistoryPage.selectAttempt(writingAttempts[0]);
      await practiceHistoryPage.selectAttempt(writingAttempts[1]);
      await practiceHistoryPage.selectAttempt(writingAttempts[2]);
      await driver.sleep(1000);

      await practiceHistoryPage.clickCompareButton();
      await driver.sleep(3000);

      const comparisonView = await practiceHistoryPage.getComparisonView();
      const errorMessage = await practiceHistoryPage.getErrorMessage();
      
      expect(comparisonView || errorMessage).toBeTruthy();
    });

    test('FUC-184: Allow comparison of exactly 5 attempts', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(5);
      
      if (writingAttempts.length >= 5) {
        for (let i = 0; i < 5; i++) {
          await practiceHistoryPage.selectAttempt(writingAttempts[i]);
        }
        await driver.sleep(1000);

        await practiceHistoryPage.clickCompareButton();
        await driver.sleep(3000);

        const comparisonView = await practiceHistoryPage.getComparisonView();
        expect(comparisonView).toBeTruthy();
      }
    });

    test('FUC-185: Block comparison with 6+ attempts (MSG-029)', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(6);
      
      if (writingAttempts.length >= 6) {
        for (let i = 0; i < 6; i++) {
          await practiceHistoryPage.selectAttempt(writingAttempts[i]);
        }
        await driver.sleep(1000);

        await practiceHistoryPage.clickCompareButton();
        await driver.sleep(2000);

        const errorMessage = await practiceHistoryPage.getErrorMessage();
        expect(errorMessage).toContain(MESSAGES.MSG_029 || 'exceed');
      }
    });

    test('FUC-186: Prevent selecting more than 5 items via UI', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(5);
      
      for (let i = 0; i < 5; i++) {
        await practiceHistoryPage.selectAttempt(writingAttempts[i]);
      }
      await driver.sleep(1000);

      const canSelect6th = await practiceHistoryPage.canSelectAttempt(writingAttempts[5]);
      expect(canSelect6th).toBe(false);
    });

    test('FUC-187: Block comparison with mixed skills (MSG-030)', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const speakingAttempts = await practiceHistoryPage.getSpeakingAttempts(1);
      const writingAttempts = await practiceHistoryPage.getWritingAttempts(1);
      
      if (speakingAttempts.length > 0 && writingAttempts.length > 0) {
        await practiceHistoryPage.selectAttempt(speakingAttempts[0]);
        await practiceHistoryPage.selectAttempt(writingAttempts[0]);
        await driver.sleep(1000);

        await practiceHistoryPage.clickCompareButton();
        await driver.sleep(2000);

        const errorMessage = await practiceHistoryPage.getErrorMessage();
        expect(errorMessage).toContain(MESSAGES.MSG_030 || 'same skill');
      }
    });

    test('FUC-188: Allow comparison of multiple Speaking attempts', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const speakingAttempts = await practiceHistoryPage.getSpeakingAttempts(2);
      
      if (speakingAttempts.length >= 2) {
        await practiceHistoryPage.selectAttempt(speakingAttempts[0]);
        await practiceHistoryPage.selectAttempt(speakingAttempts[1]);
        await driver.sleep(1000);

        await practiceHistoryPage.clickCompareButton();
        await driver.sleep(3000);

        const comparisonView = await practiceHistoryPage.getComparisonView();
        expect(comparisonView).toBeTruthy();
      }
    });

    test('FUC-189: Allow comparison of multiple Writing attempts', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(2);
      
      if (writingAttempts.length >= 2) {
        await practiceHistoryPage.selectAttempt(writingAttempts[0]);
        await practiceHistoryPage.selectAttempt(writingAttempts[1]);
        await driver.sleep(1000);

        await practiceHistoryPage.clickCompareButton();
        await driver.sleep(3000);

        const comparisonView = await practiceHistoryPage.getComparisonView();
        expect(comparisonView).toBeTruthy();
      }
    });

    test('FUC-190: Mixed selection error with 3+ items (1 mismatching)', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(2);
      const speakingAttempts = await practiceHistoryPage.getSpeakingAttempts(1);
      
      if (writingAttempts.length >= 2 && speakingAttempts.length > 0) {
        await practiceHistoryPage.selectAttempt(writingAttempts[0]);
        await practiceHistoryPage.selectAttempt(writingAttempts[1]);
        await practiceHistoryPage.selectAttempt(speakingAttempts[0]);
        await driver.sleep(1000);

        await practiceHistoryPage.clickCompareButton();
        await driver.sleep(2000);

        const errorMessage = await practiceHistoryPage.getErrorMessage();
        expect(errorMessage).toContain(MESSAGES.MSG_030 || 'same skill');
      }
    });
  });

  // ==================== REQ061-REQ062: Charts & Indicators ====================
  describe('REQ061-REQ062: Comparison Charts & Score Indicators', () => {
    
    test('FUC-191: Display Radar Chart for sub-score comparison', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(2);
      
      await practiceHistoryPage.selectAttempt(writingAttempts[0]);
      await practiceHistoryPage.selectAttempt(writingAttempts[1]);
      await practiceHistoryPage.clickCompareButton();
      await driver.sleep(3000);

      const radarChart = await practiceHistoryPage.getRadarChart();
      expect(radarChart).toBeTruthy();
    });

    test('FUC-192: Display Line Chart for score progression', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(2);
      
      await practiceHistoryPage.selectAttempt(writingAttempts[0]);
      await practiceHistoryPage.selectAttempt(writingAttempts[1]);
      await practiceHistoryPage.clickCompareButton();
      await driver.sleep(3000);

      const lineChart = await practiceHistoryPage.getLineChart();
      expect(lineChart).toBeTruthy();
    });

    test('FUC-193: Chart data matches numerical values', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(2);
      
      await practiceHistoryPage.selectAttempt(writingAttempts[0]);
      await practiceHistoryPage.selectAttempt(writingAttempts[1]);
      await practiceHistoryPage.clickCompareButton();
      await driver.sleep(3000);

      const scores = await practiceHistoryPage.getScoresFromTable();
      const chartData = await practiceHistoryPage.getChartDataValues();
      expect(chartData).toEqual(scores);
    });

    test('FUC-194: Display improvement indicator (↑) with percentage', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(2);
      
      const attempt1Score = await practiceHistoryPage.getAttemptScore(writingAttempts[0]);
      const attempt2Score = await practiceHistoryPage.getAttemptScore(writingAttempts[1]);
      
      if (attempt2Score > attempt1Score) {
        await practiceHistoryPage.selectAttempt(writingAttempts[0]);
        await practiceHistoryPage.selectAttempt(writingAttempts[1]);
        await practiceHistoryPage.clickCompareButton();
        await driver.sleep(3000);

        const improvementIndicator = await practiceHistoryPage.getImprovementIndicator();
        expect(improvementIndicator).toContain('↑');
        expect(improvementIndicator).toContain('%');
      }
    });

    test('FUC-195: Display decline indicator (↓) with percentage', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(2);
      
      const attempt1Score = await practiceHistoryPage.getAttemptScore(writingAttempts[0]);
      const attempt2Score = await practiceHistoryPage.getAttemptScore(writingAttempts[1]);
      
      if (attempt2Score < attempt1Score) {
        await practiceHistoryPage.selectAttempt(writingAttempts[0]);
        await practiceHistoryPage.selectAttempt(writingAttempts[1]);
        await practiceHistoryPage.clickCompareButton();
        await driver.sleep(3000);

        const declineIndicator = await practiceHistoryPage.getDeclineIndicator();
        expect(declineIndicator).toContain('↓');
        expect(declineIndicator).toContain('%');
      }
    });

    test('FUC-196: Display neutral indicator (0%) when scores are equal', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(2);
      
      const attempt1Score = await practiceHistoryPage.getAttemptScore(writingAttempts[0]);
      const attempt2Score = await practiceHistoryPage.getAttemptScore(writingAttempts[1]);
      
      if (attempt1Score === attempt2Score) {
        await practiceHistoryPage.selectAttempt(writingAttempts[0]);
        await practiceHistoryPage.selectAttempt(writingAttempts[1]);
        await practiceHistoryPage.clickCompareButton();
        await driver.sleep(3000);

        const neutralIndicator = await practiceHistoryPage.getNeutralIndicator();
        expect(neutralIndicator).toContain('0%');
      }
    });

    test('FUC-197: Sub-score indicators show improvement/decline', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(3000);

      const writingAttempts = await practiceHistoryPage.getWritingAttempts(2);
      
      await practiceHistoryPage.selectAttempt(writingAttempts[0]);
      await practiceHistoryPage.selectAttempt(writingAttempts[1]);
      await practiceHistoryPage.clickCompareButton();
      await driver.sleep(3000);

      const subscoreIndicators = await practiceHistoryPage.getSubscoreIndicators();
      
      subscoreIndicators.forEach(indicator => {
        expect(indicator).toMatch(/↑|↓|-/);
      });
    });
  });
});
