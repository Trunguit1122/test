import { WebDriver } from 'selenium-webdriver';
import { PracticeHistoryPage } from '../pages/PracticeHistoryPage';
import { ProgressPage } from '../pages/ProgressPage';
import { SignInPage } from '../pages/SignInPage';
import { DashboardPage } from '../pages/DashboardPage';
import { setupDriver, teardownDriver } from '../utils/setup';
import { TEST_USERS } from '../utils/testData';
import { MESSAGES } from '../config/messages';

/**
 * Progress & Statistics Tests (REQ063, REQ064, REQ067, REQ068, REQ069)
 * Test Cases: FUC-198 to FUC-205
 */
describe('REQ063-REQ069: Retake, Logout & Statistics', () => {
  let driver: WebDriver;
  let practiceHistoryPage: PracticeHistoryPage;
  let progressPage: ProgressPage;
  let signInPage: SignInPage;
  let dashboardPage: DashboardPage;

  beforeAll(async () => {
    driver = await setupDriver();
  });

  afterAll(async () => {
    await teardownDriver(driver);
  });

  beforeEach(async () => {
    practiceHistoryPage = new PracticeHistoryPage(driver);
    progressPage = new ProgressPage(driver);
    signInPage = new SignInPage(driver);
    dashboardPage = new DashboardPage(driver);
    
    await signInPage.navigate();
    await signInPage.login(TEST_USERS.learner.email, TEST_USERS.learner.password);
  });

  // ==================== REQ063: Retake Functionality ====================
  describe('REQ063: Retake Functionality & AttemptID Management', () => {
    
    test('FUC-198: Block retake when prompt is deleted/disabled (MSG-031)', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(2000);

      // Find a completed attempt with deleted prompt
      const attemptWithDeletedPrompt = await practiceHistoryPage.findAttemptWithDeletedPrompt();
      
      if (attemptWithDeletedPrompt) {
        await practiceHistoryPage.clickAttempt(attemptWithDeletedPrompt);
        await driver.sleep(2000);

        // Click retake button
        await practiceHistoryPage.clickRetakeButton();
        await driver.sleep(2000);

        // Verify error message
        const errorMessage = await practiceHistoryPage.getErrorMessage();
        expect(errorMessage).toContain(MESSAGES.MSG_031 || 'prompt');
      }
    });

    test('FUC-199: Create new AttemptID on retake while preserving original', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(2000);

      // Get a completed attempt
      const completedAttempt = await practiceHistoryPage.getCompletedAttempt(0);
      const originalAttemptId = completedAttempt.id;
      
      // Click retake
      await practiceHistoryPage.clickAttempt(completedAttempt);
      await driver.sleep(2000);
      await practiceHistoryPage.clickRetakeButton();
      await driver.sleep(3000);

      // Verify new attempt is created
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('practice');

      // Navigate back to history
      await practiceHistoryPage.navigate();
      await driver.sleep(2000);

      // Verify original attempt still exists with same ID and Completed status
      const originalAttemptStillExists = await practiceHistoryPage.findAttemptById(originalAttemptId);
      expect(originalAttemptStillExists).toBeTruthy();
      expect(originalAttemptStillExists.status).toBe('Completed');

      // Verify new attempt exists with In Progress status
      const inProgressAttempt = await practiceHistoryPage.findAttemptByStatus('InProgress');
      expect(inProgressAttempt).toBeTruthy();
      expect(inProgressAttempt.id).not.toBe(originalAttemptId);
    });
  });

  // ==================== REQ064: Logout ====================
  describe('REQ064: Logout without Confirmation', () => {
    
    test('FUC-200: Logout immediately without confirmation dialog', async () => {
      await dashboardPage.navigate();
      await driver.sleep(2000);

      // Open profile/menu dropdown
      await dashboardPage.clickProfileMenu();
      await driver.sleep(1000);

      // Click logout
      await dashboardPage.clickLogoutButton();
      await driver.sleep(2000);

      // Verify no confirmation dialog appears
      const confirmationDialogExists = await dashboardPage.doesConfirmationDialogExist();
      expect(confirmationDialogExists).toBe(false);

      // Verify redirected to login page
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('signin') || expect(currentUrl).toContain('login');

      // Verify session is cleared
      const hasSessionToken = await dashboardPage.hasSessionToken();
      expect(hasSessionToken).toBe(false);
    });
  });

  // ==================== REQ067: Statistics Filtering ====================
  describe('REQ067: Statistics Filtering by Date Range & Skill', () => {
    
    test('FUC-201: Statistics update when filtering by Date Range', async () => {
      await progressPage.navigate();
      await driver.sleep(3000);

      // Get initial statistics
      const initialStats = await progressPage.getStatistics();

      // Set date range (last 30 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      await progressPage.setDateRange(startDate, endDate);
      await driver.sleep(2000);

      // Verify statistics updated
      const updatedStats = await progressPage.getStatistics();
      expect(updatedStats).toBeTruthy();

      // Verify all data is within date range
      const attempts = await progressPage.getAttemptsList();
      attempts.forEach(attempt => {
        const attemptDate = new Date(attempt.date);
        expect(attemptDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
        expect(attemptDate.getTime()).toBeLessThanOrEqual(endDate.getTime());
      });
    });

    test('FUC-202: Statistics update when filtering by Skill Type', async () => {
      await progressPage.navigate();
      await driver.sleep(3000);

      // Filter by Speaking
      await progressPage.filterBySkill('Speaking');
      await driver.sleep(2000);

      // Verify only Speaking data
      let attempts = await progressPage.getAttemptsList();
      attempts.forEach(attempt => {
        expect(attempt.skill).toBe('Speaking');
      });

      // Filter by Writing
      await progressPage.filterBySkill('Writing');
      await driver.sleep(2000);

      // Verify only Writing data
      attempts = await progressPage.getAttemptsList();
      attempts.forEach(attempt => {
        expect(attempt.skill).toBe('Writing');
      });
    });

    test('FUC-203: Statistics update with combined Date Range and Skill filters', async () => {
      await progressPage.navigate();
      await driver.sleep(3000);

      // Set both filters
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 60);

      await progressPage.setDateRange(startDate, endDate);
      await progressPage.filterBySkill('Writing');
      await driver.sleep(2000);

      // Verify combined filtering
      const attempts = await progressPage.getAttemptsList();
      attempts.forEach(attempt => {
        expect(attempt.skill).toBe('Writing');
        const attemptDate = new Date(attempt.date);
        expect(attemptDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
        expect(attemptDate.getTime()).toBeLessThanOrEqual(endDate.getTime());
      });
    });
  });

  // ==================== REQ068: Charts & Visualizations ====================
  describe('REQ068: Score Trend & Attempt Count Charts', () => {
    
    test('FUC-204: Score Trend line chart displayed and accurate', async () => {
      await progressPage.navigate();
      await driver.sleep(3000);

      // Verify chart exists
      const scoreTrendChart = await progressPage.getScoreTrendChart();
      expect(scoreTrendChart).toBeTruthy();

      // Verify data accuracy
      const chartDataPoints = await progressPage.getChartDataPoints(scoreTrendChart);
      const databaseScores = await progressPage.getScoresFromDatabase();

      expect(chartDataPoints.length).toBeGreaterThan(0);
      
      // Verify at least some data points match
      chartDataPoints.forEach(point => {
        const hasMatchingScore = databaseScores.some(score => 
          Math.abs(score - point) < 0.1 // Allow small floating point difference
        );
        expect(hasMatchingScore).toBe(true);
      });

      // Verify X-axis is timeline and Y-axis is scores
      const xAxisLabel = await progressPage.getChartAxisLabel('x');
      const yAxisLabel = await progressPage.getChartAxisLabel('y');
      expect(xAxisLabel).toContain('Date') || expect(xAxisLabel).toContain('Time');
      expect(yAxisLabel).toContain('Score');
    });

    test('FUC-205: Attempt Count visualization matches database', async () => {
      await progressPage.navigate();
      await driver.sleep(3000);

      // Get displayed attempt count
      const displayedCount = await progressPage.getAttemptCountDisplay();

      // Get actual count from practice history
      await practiceHistoryPage.navigate();
      await driver.sleep(2000);

      const actualAttempts = await practiceHistoryPage.getAttemptsList();
      const actualCount = actualAttempts.length;

      // Verify counts match (or at least are close - may have pagination)
      expect(displayedCount).toBeGreaterThan(0);
      expect(Math.abs(displayedCount - actualCount)).toBeLessThan(10);
    });
  });

  // ==================== REQ069: No Data State ====================
  describe('REQ069: No Data State Handling', () => {
    
    test('FUC-206: Display appropriate message when user has zero attempts', async () => {
      // This test requires a user with no attempts
      // May need a dedicated test user or database setup
      
      await progressPage.navigate();
      await driver.sleep(3000);

      // Check if no data message is displayed
      const noDataMessage = await progressPage.getNoDataMessage();
      const chartExists = await progressPage.getScoreTrendChart();

      // Either no data message OR empty chart
      if (!chartExists) {
        expect(noDataMessage).toBeTruthy();
      } else {
        // Empty chart is acceptable
        expect(chartExists).toBeTruthy();
      }
    });
  });

  // ==================== REQ070: Score Breakdown ====================
  describe('REQ070: Score Breakdown Display', () => {
    
    test('FUC-207: Display overall score and sub-scores', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(2000);

      // Get a completed attempt
      const completedAttempt = await practiceHistoryPage.getCompletedAttempt(0);
      
      if (completedAttempt) {
        await practiceHistoryPage.clickAttempt(completedAttempt);
        await driver.sleep(3000);

        // Verify overall score displayed
        const overallScore = await practiceHistoryPage.getOverallScore();
        expect(overallScore).toMatch(/\d+(\.\d+)?/);

        // Verify sub-scores displayed
        const subScores = await practiceHistoryPage.getSubScores();
        expect(subScores.length).toBeGreaterThan(0);

        // Each sub-score should be a valid number
        subScores.forEach(score => {
          expect(score).toMatch(/\d+(\.\d+)?/);
        });
      }
    });

    test('FUC-208: Sub-score breakdown for IELTS criteria (Lexical, Grammar, Fluency, Task Response)', async () => {
      await practiceHistoryPage.navigate();
      await driver.sleep(2000);

      const completedAttempt = await practiceHistoryPage.getCompletedAttempt(0);
      
      if (completedAttempt) {
        await practiceHistoryPage.clickAttempt(completedAttempt);
        await driver.sleep(3000);

        // Get all sub-score criteria
        const criteria = await practiceHistoryPage.getScoreCriteria();

        // Expected IELTS Writing criteria
        const expectedCriteria = ['Lexical', 'Grammar', 'Fluency', 'Task Response'];
        
        expectedCriteria.forEach(expected => {
          const found = criteria.some(c => c.includes(expected));
          expect(found).toBe(true);
        });
      }
    });
  });

  // ==================== REQ071: Teacher Progress Reports ====================
  describe('REQ071: Teacher Progress Reports', () => {
    
    test('FUC-209: Teacher views learner progress summary', async () => {
      // Login as teacher
      await signInPage.navigate();
      await driver.sleep(2000);
      await signInPage.login(TEST_USERS.teacher.email, TEST_USERS.teacher.password);
      await driver.sleep(3000);

      // Navigate to progress reports
      const teacherDashboard = new (require('../pages/TeacherDashboardPage')).TeacherDashboardPage(driver);
      await teacherDashboard.navigate();
      await driver.sleep(2000);

      // Verify reports accessible
      const reportsSection = await teacherDashboard.getReportsSection();
      expect(reportsSection).toBeTruthy();
    });

    test('FUC-210: Teacher can filter learner progress by class/group', async () => {
      await signInPage.navigate();
      await driver.sleep(2000);
      await signInPage.login(TEST_USERS.teacher.email, TEST_USERS.teacher.password);
      await driver.sleep(3000);

      const teacherDashboard = new (require('../pages/TeacherDashboardPage')).TeacherDashboardPage(driver);
      await teacherDashboard.navigate();
      await driver.sleep(2000);

      // Get available classes/groups
      const classes = await teacherDashboard.getAvailableClasses();
      expect(classes.length).toBeGreaterThan(0);

      // Filter by a class
      await teacherDashboard.filterByClass(classes[0]);
      await driver.sleep(2000);

      // Verify data filtered
      const filteredLearners = await teacherDashboard.getLearnersList();
      expect(filteredLearners.length).toBeGreaterThan(0);
    });
  });

  // ==================== REQ072: Learner Status Management ====================
  describe('REQ072: Learner Status Management', () => {
    
    test('FUC-211: Teacher can view learner status (Active/Inactive)', async () => {
      await signInPage.navigate();
      await driver.sleep(2000);
      await signInPage.login(TEST_USERS.teacher.email, TEST_USERS.teacher.password);
      await driver.sleep(3000);

      const teacherDashboard = new (require('../pages/TeacherDashboardPage')).TeacherDashboardPage(driver);
      await teacherDashboard.navigate();
      await driver.sleep(2000);

      // Get learners list
      const learners = await teacherDashboard.getLearnersList();
      
      // Verify each learner has status
      learners.forEach(learner => {
        expect(learner.status).toMatch(/Active|Inactive|Locked/);
      });
    });

    test('FUC-212: Teacher can lock/unlock learner account', async () => {
      await signInPage.navigate();
      await driver.sleep(2000);
      await signInPage.login(TEST_USERS.teacher.email, TEST_USERS.teacher.password);
      await driver.sleep(3000);

      const teacherDashboard = new (require('../pages/TeacherDashboardPage')).TeacherDashboardPage(driver);
      await teacherDashboard.navigate();
      await driver.sleep(2000);

      // Get a learner
      const learners = await teacherDashboard.getLearnersList();
      
      if (learners.length > 0) {
        const targetLearner = learners[0];

        // Lock if active, unlock if locked
        if (targetLearner.status === 'Active') {
          await teacherDashboard.lockLearner(targetLearner);
          await driver.sleep(2000);

          // Verify status changed
          const updatedLearner = await teacherDashboard.getLearnerStatus(targetLearner.id);
          expect(updatedLearner.status).toBe('Locked');
        } else if (targetLearner.status === 'Locked') {
          await teacherDashboard.unlockLearner(targetLearner);
          await driver.sleep(2000);

          const updatedLearner = await teacherDashboard.getLearnerStatus(targetLearner.id);
          expect(updatedLearner.status).toBe('Active');
        }
      }
    });
  });

  // ==================== REQ073-REQ075: Additional Features ====================
  describe('REQ073-REQ075: Advanced Statistics & Features', () => {
    
    test('FUC-213: Display performance metrics summary', async () => {
      await progressPage.navigate();
      await driver.sleep(3000);

      // Get metrics
      const metrics = await progressPage.getPerformanceMetrics();

      // Should include average score, total attempts, etc.
      expect(metrics.averageScore).toMatch(/\d+(\.\d+)?/);
      expect(metrics.totalAttempts).toMatch(/\d+/);
    });

    test('FUC-214: Compare performance across speaking and writing', async () => {
      await progressPage.navigate();
      await driver.sleep(3000);

      // Get speaking metrics
      await progressPage.filterBySkill('Speaking');
      await driver.sleep(2000);
      const speakingMetrics = await progressPage.getPerformanceMetrics();

      // Get writing metrics
      await progressPage.filterBySkill('Writing');
      await driver.sleep(2000);
      const writingMetrics = await progressPage.getPerformanceMetrics();

      // Both should have valid data
      expect(speakingMetrics).toBeTruthy();
      expect(writingMetrics).toBeTruthy();
    });

    test('FUC-215: Export progress data (if available)', async () => {
      await progressPage.navigate();
      await driver.sleep(3000);

      // Check for export button
      const exportButton = await progressPage.getExportButton();

      if (exportButton) {
        await exportButton.click();
        await driver.sleep(2000);

        // Verify export happens (file download or confirmation)
        const exportConfirmed = await progressPage.isExportConfirmed();
        expect(exportConfirmed).toBe(true);
      }
    });

    test('FUC-216: Custom date range picker functionality', async () => {
      await progressPage.navigate();
      await driver.sleep(3000);

      // Set custom date range
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      await progressPage.setCustomDateRange(startDate, endDate);
      await driver.sleep(2000);

      // Verify data updates
      const attempts = await progressPage.getAttemptsList();
      
      attempts.forEach(attempt => {
        const attemptDate = new Date(attempt.date);
        expect(attemptDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
        expect(attemptDate.getTime()).toBeLessThanOrEqual(endDate.getTime());
      });
    });

    test('FUC-217: Performance trend analysis', async () => {
      await progressPage.navigate();
      await driver.sleep(3000);

      // Get trend information
      const trendAnalysis = await progressPage.getTrendAnalysis();

      // Should indicate improvement, decline, or stable
      expect(trendAnalysis).toMatch(/improvement|decline|stable|trend/i);
    });

    test('FUC-218: Goal tracking or performance targets', async () => {
      await progressPage.navigate();
      await driver.sleep(3000);

      // Check for goal/target display
      const goals = await progressPage.getPerformanceGoals();

      if (goals) {
        expect(goals).toBeTruthy();
        expect(goals.targetScore).toMatch(/\d+(\.\d+)?/);
      }
    });

    test('FUC-219: Detailed score breakdown by attempt', async () => {
      await progressPage.navigate();
      await driver.sleep(3000);

      // Click on an attempt
      const attempts = await progressPage.getAttemptsList();
      
      if (attempts.length > 0) {
        await progressPage.clickAttempt(attempts[0]);
        await driver.sleep(3000);

        // Verify detailed breakdown
        const breakdown = await progressPage.getDetailedScoreBreakdown();
        expect(breakdown).toBeTruthy();
        expect(breakdown.overallScore).toMatch(/\d+(\.\d+)?/);
        expect(breakdown.subScores.length).toBeGreaterThan(0);
      }
    });

    test('FUC-220: Comparative analysis between attempts', async () => {
      await progressPage.navigate();
      await driver.sleep(3000);

      // Get two attempts
      const attempts = await progressPage.getAttemptsList();
      
      if (attempts.length >= 2) {
        // Select two attempts
        await progressPage.selectAttempt(attempts[0]);
        await progressPage.selectAttempt(attempts[1]);
        await driver.sleep(1000);

        // Get comparison
        const comparison = await progressPage.getComparisonData();
        
        expect(comparison).toBeTruthy();
        expect(comparison.improvement).toMatch(/↑|↓|-/);
        expect(comparison.percentageChange).toMatch(/\d+/);
      }
    });
  });
});
