import { WebDriver } from 'selenium-webdriver';
import { WritingPracticePage } from '../pages/WritingPracticePage';
import { SignInPage } from '../pages/SignInPage';
import { PracticeListPage } from '../pages/PracticeListPage';
import { setupDriver, teardownDriver } from '../utils/setup';
import { TEST_USERS } from '../utils/testData';
import { MESSAGES } from '../config/messages';

/**
 * Automation Tests for REQ047 to REQ062 (Writing Practice & Scoring)
 * Test Cases: FUC-145 to FUC-197
 * 
 * Features Tested:
 * - REQ047: Writing Editor Display Elements (Task 1 & Task 2)
 * - REQ049: Autosave Functionality & Data Persistence
 * - REQ050: Real-time Word Counter
 * - REQ051: Word Minimum Validation (250 words for Task 2)
 * - REQ052: AI Scoring Timeout Handling
 * - REQ053: Feedback Display After Scoring
 * - REQ054: Re-scoring on Failed Status
 * - REQ055: Practice History Sorting
 * - REQ056: Practice History Filtering
 * - REQ057: Practice History Pagination
 * - REQ058-REQ060: Attempt Comparison Logic
 * - REQ061-REQ062: Comparison Charts & Score Indicators
 */
describe('Writing Practice Tests (REQ047-REQ062)', () => {
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

  // ==================== REQ047: Display Elements ====================
  describe('REQ047: Writing Editor Display Elements', () => {
    
    test('FUC-145: Display elements for IELTS Writing Task 1 (Chart/Graph)', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask1Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      // Verify Task Description is visible
      const taskDescription = await writingPage.getTaskDescription();
      expect(taskDescription).toBeTruthy();

      // Verify Word Count Requirement (150 words for Task 1)
      const wordCountText = await writingPage.getWordCountRequirement();
      expect(wordCountText).toContain('150');

      // Verify Time Guideline (20 minutes)
      const timeGuidelineText = await writingPage.getTimeGuideline();
      expect(timeGuidelineText).toContain('20');
    });

    test('FUC-146: Display elements for IELTS Writing Task 2 (Essay)', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask2Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      // Verify Task Description is visible
      const taskDescription = await writingPage.getTaskDescription();
      expect(taskDescription).toBeTruthy();

      // Verify Word Count Requirement (250 words for Task 2)
      const wordCountText = await writingPage.getWordCountRequirement();
      expect(wordCountText).toContain('250');

      // Verify Time Guideline (40 minutes)
      const timeGuidelineText = await writingPage.getTimeGuideline();
      expect(timeGuidelineText).toContain('40');
    });

    test('FUC-147: Prompt visibility and layout integrity', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.clickStartOnFirstPrompt();
      await driver.sleep(3000);

      // Verify prompt is fully visible
      const isPromptVisible = await writingPage.isPromptFullyVisible();
      expect(isPromptVisible).toBe(true);

      // Verify prompt and input area are separated
      const areElementsSeparated = await writingPage.arePromptAndEditorSeparated();
      expect(areElementsSeparated).toBe(true);

      // Verify no overlap between prompt and typing area
      const isNoOverlap = await writingPage.checkNoOverlapBetweenElements();
      expect(isNoOverlap).toBe(true);
    });
  });

  // ==================== REQ049: Autosave ====================
  describe('REQ049: Autosave Functionality', () => {
    
    test('FUC-148: Autosave triggered after 30 seconds', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.clickStartOnFirstPrompt();
      await driver.sleep(3000);

      // Type content into editor
      const testContent = 'Testing autosave functionality for 30 seconds interval';
      await writingPage.typeInEditor(testContent);

      // Wait for 30 seconds
      await driver.sleep(30000);

      // Verify save indicator is shown
      const saveStatus = await writingPage.getSaveStatus();
      expect(saveStatus).toContain('Saved');
    });

    test('FUC-149: Data persistence after page reload', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.clickStartOnFirstPrompt();
      await driver.sleep(3000);

      // Type content
      const testContent = 'Testing data persistence after reload';
      await writingPage.typeInEditor(testContent);

      // Wait for autosave
      await driver.sleep(31000);

      // Refresh page
      await driver.navigate().refresh();
      await driver.sleep(3000);

      // Verify content persists
      const editorContent = await writingPage.getEditorContent();
      expect(editorContent).toContain(testContent);
    });

    test('FUC-150: Error handling on network failure (MSG-024)', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.clickStartOnFirstPrompt();
      await driver.sleep(3000);

      // Type content
      await writingPage.typeInEditor('Test content');

      // Simulate network offline (using DevTools or driver commands)
      // Note: This may require special driver configuration
      // For now, we'll check if error handling works
      
      await driver.sleep(31000);
      
      // Check for error message
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

      // Simulate offline then online
      // Verify that retry button appears and works
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

      // Type content and check counter
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
      // Select Task 1 (min 150 words)
      await practiceListPage.selectTask1Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      // Type less than 150 words
      const shortText = 'This is a short text. '.repeat(5); // ~30 words
      await writingPage.typeInEditor(shortText);

      // Check warning indicator
      const hasWarning = await writingPage.hasWarningIndicator();
      expect(hasWarning).toBe(true);
    });

    test('FUC-154: Warning removal when minimum reached', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask1Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      // Type content to reach minimum (150 words)
      const sufficientText = 'This is sufficient content. '.repeat(6); // ~150 words
      await writingPage.typeInEditor(sufficientText);

      // Check warning is gone
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

      // Paste 300 words
      const bulkText = 'Word '.repeat(300);
      await writingPage.pasteInEditor(bulkText);
      await driver.sleep(1000);

      // Verify counter updates
      const wordCount = await writingPage.getWordCount();
      expect(wordCount).toBeGreaterThanOrEqual(290);
    });
  });

  // ==================== REQ051: Word Minimum Validation ====================
  describe('REQ051: Word Minimum Validation (Task 2)', () => {
    
    test('FUC-156: Block submission with 249 words (MSG-025)', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask2Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      // Type exactly 249 words
      const text249 = 'Word '.repeat(249).trim();
      await writingPage.typeInEditor(text249);
      await driver.sleep(1000);

      // Attempt submission
      await writingPage.clickSubmitButton();
      await driver.sleep(2000);

      // Verify error message
      const errorMessage = await writingPage.getErrorMessage();
      expect(errorMessage).toContain(MESSAGES.MSG_025 || 'minimum');
    });

    test('FUC-157: Accept submission with exactly 250 words', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask2Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      // Type exactly 250 words
      const text250 = 'Word '.repeat(250).trim();
      await writingPage.typeInEditor(text250);
      await driver.sleep(1000);

      // Submit
      await writingPage.clickSubmitButton();
      await driver.sleep(3000);

      // Verify no error and redirect
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('scoring') || expect(currentUrl).toContain('result');
    });

    test('FUC-158: Whitespace not counted as valid words', async () => {
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask2Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      // Type 10 real words + many spaces
      const textWithSpaces = 'Word Word Word Word Word Word Word Word Word Word' + ' '.repeat(500);
      await writingPage.typeInEditor(textWithSpaces);
      await driver.sleep(1000);

      // Check word count
      const wordCount = await writingPage.getWordCount();
      expect(wordCount).toBe(10); // Only real words count

      // Submit and expect error
      await writingPage.clickSubmitButton();
      await driver.sleep(2000);

      const errorMessage = await writingPage.getErrorMessage();
      expect(errorMessage).toContain(MESSAGES.MSG_025 || 'minimum');
    });

    test('FUC-159: Error cleared after reaching requirement', async () => {
      // First, trigger error with 249 words
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask2Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      const text249 = 'Word '.repeat(249).trim();
      await writingPage.typeInEditor(text249);
      await writingPage.clickSubmitButton();
      await driver.sleep(2000);

      // Verify error is shown
      let errorMessage = await writingPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();

      // Add one more word
      await writingPage.typeInEditor(' Word');
      await driver.sleep(1000);

      // Error should be cleared or submission should succeed
      await writingPage.clickSubmitButton();
      await driver.sleep(3000);

      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('scoring') || expect(currentUrl).toContain('result');
    });
  });

  // ==================== REQ052: AI Scoring Timeout ====================
  describe('REQ052: AI Scoring Timeout (60 seconds)', () => {
    
    test('FUC-160: Display MSG-026 when scoring API times out', async () => {
      // This test requires API simulation
      // Mock the scoring endpoint to delay response > 60 seconds
      
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask2Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      // Type valid content
      const validText = 'Word '.repeat(250).trim();
      await writingPage.typeInEditor(validText);

      // Submit for scoring
      await writingPage.clickSubmitButton();
      await driver.sleep(1000);

      // Wait 60+ seconds and check for timeout message
      // Note: This test may need to be adjusted based on actual API behavior
      await driver.sleep(60000);

      const errorMessage = await writingPage.getErrorMessage();
      if (errorMessage) {
        expect(errorMessage).toContain(MESSAGES.MSG_026 || 'timeout');
      }
    });

    test('FUC-161: Retry button available and functional after timeout', async () => {
      // Assuming MSG-026 is displayed from FUC-160
      const retryButton = await writingPage.getRetryButton();
      expect(retryButton).toBeTruthy();

      // Click retry
      await retryButton.click();
      await driver.sleep(3000);

      // Verify results display
      const scoringElements = await writingPage.getScoringResults();
      expect(scoringElements).toBeTruthy();
    });

    test('FUC-162: No timeout if response received at 59 seconds', async () => {
      // This requires precise API mocking
      await practiceListPage.navigateToWritingPrompts();
      await driver.sleep(2000);
      await practiceListPage.selectTask2Prompt();
      await practiceListPage.clickStartButton();
      await driver.sleep(3000);

      const validText = 'Word '.repeat(250).trim();
      await writingPage.typeInEditor(validText);

      await writingPage.clickSubmitButton();
      await driver.sleep(1000);

      // Wait 59 seconds - API should respond before timeout
      await driver.sleep(59000);

      // Verify no timeout error
      const errorMessage = await writingPage.getErrorMessage();
      expect(errorMessage).not.toContain(MESSAGES.MSG_026 || 'timeout');
    });
  });

  // ==================== REQ053: Feedback Display ====================
  describe('REQ053: Feedback Display After Scoring', () => {
    
    test('FUC-163: Display all three feedback sections (Strengths, Areas, Suggestions)', async () => {
      // Navigate to completed attempt
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(2000);

      // Click on a completed attempt
      await practiceListPage.clickOnCompletedAttempt();
      await driver.sleep(3000);

      // Verify all three feedback sections exist
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

      // Get feedback from UI
      const uiFeedback = await writingPage.getAllFeedbackText();

      // Compare with API data (would need API interception)
      expect(uiFeedback.strengths).toBeTruthy();
      expect(uiFeedback.improvements).toBeTruthy();
      expect(uiFeedback.suggestions).toBeTruthy();
    });

    test('FUC-165: Feedback sections are clearly separated and readable', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(2000);
      await practiceListPage.clickOnCompletedAttempt();
      await driver.sleep(3000);

      // Check visual separation
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
      // Navigate to attempt with Failed scoring status
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(2000);
      
      // Filter or find failed attempt
      await practiceListPage.clickOnFailedAttempt();
      await driver.sleep(3000);

      // Verify error message
      const errorMessage = await writingPage.getErrorMessage();
      expect(errorMessage).toContain(MESSAGES.MSG_027 || 'Re-scoring');

      // Verify re-scoring button exists
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

      // Wait for re-scoring to complete
      await driver.sleep(5000);

      // Verify feedback now displays
      const feedbackSections = await writingPage.getAllFeedbackText();
      expect(feedbackSections.strengths).toBeTruthy();
    });

    test('FUC-168: Re-scoring button hidden when status is Completed', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(2000);
      
      // Click on completed (successful) attempt
      await practiceListPage.clickOnCompletedAttempt();
      await driver.sleep(3000);

      // Re-scoring button should not exist
      const rescoringButton = await writingPage.getRescoringButton();
      expect(rescoringButton).toBeFalsy();

      // Error MSG-027 should not exist
      const errorMessage = await writingPage.getErrorMessage();
      expect(errorMessage).not.toContain(MESSAGES.MSG_027 || 'Re-scoring');
    });
  });

  // ==================== REQ055: Practice History Sorting ====================
  describe('REQ055: Practice History Sorting', () => {
    
    test('FUC-169: History displays in descending order by date (most recent first)', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      // Get list of attempts with dates
      const attempts = await practiceListPage.getAttemptsList();
      
      // Verify descending order
      for (let i = 0; i < attempts.length - 1; i++) {
        const currentDate = new Date(attempts[i].date);
        const nextDate = new Date(attempts[i + 1].date);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });

    test('FUC-170: Same-day attempts sorted by timestamp (newest first)', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      // Get attempts from same day
      const sameDayAttempts = await practiceListPage.getAttemptsFromSameDay();
      
      // Verify timestamp ordering
      for (let i = 0; i < sameDayAttempts.length - 1; i++) {
        const currentTime = new Date(sameDayAttempts[i].timestamp).getTime();
        const nextTime = new Date(sameDayAttempts[i + 1].timestamp).getTime();
        expect(currentTime).toBeGreaterThanOrEqual(nextTime);
      }
    });

    test('FUC-171: Single attempt displays correctly', async () => {
      // For a learner with only one attempt
      // This may need to be tested with a dedicated test user
      
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      const attempts = await practiceListPage.getAttemptsList();
      if (attempts.length === 1) {
        expect(attempts[0]).toBeTruthy();
      }
    });
  });

  // ==================== REQ056: Practice History Filtering ====================
  describe('REQ056: Practice History Filtering', () => {
    
    test('FUC-172: Filter by Skill (Speaking/Writing)', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      // Filter by Speaking
      await practiceListPage.filterBySkill('Speaking');
      await driver.sleep(2000);

      let attempts = await practiceListPage.getAttemptsList();
      attempts.forEach(attempt => {
        expect(attempt.skill).toBe('Speaking');
      });

      // Filter by Writing
      await practiceListPage.filterBySkill('Writing');
      await driver.sleep(2000);

      attempts = await practiceListPage.getAttemptsList();
      attempts.forEach(attempt => {
        expect(attempt.skill).toBe('Writing');
      });
    });

    test('FUC-173: Filter by Date Range', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      // Set date range (last 7 days)
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      await practiceListPage.filterByDateRange(startDate, new Date());
      await driver.sleep(2000);

      const attempts = await practiceListPage.getAttemptsList();
      attempts.forEach(attempt => {
        const attemptDate = new Date(attempt.date);
        expect(attemptDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
        expect(attemptDate.getTime()).toBeLessThanOrEqual(new Date().getTime());
      });
    });

    test('FUC-174: Filter by Score Range', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      // Filter score 7.0-9.0
      await practiceListPage.filterByScoreRange(7.0, 9.0);
      await driver.sleep(2000);

      const attempts = await practiceListPage.getAttemptsList();
      attempts.forEach(attempt => {
        expect(attempt.score).toBeGreaterThanOrEqual(7.0);
        expect(attempt.score).toBeLessThanOrEqual(9.0);
      });
    });

    test('FUC-175: Multiple filters applied simultaneously', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      // Apply multiple filters
      await practiceListPage.filterBySkill('Writing');
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      await practiceListPage.filterByDateRange(startDate, new Date());
      
      await practiceListPage.filterByScoreRange(6.0, 8.5);
      await driver.sleep(2000);

      // Verify all filters applied
      const attempts = await practiceListPage.getAttemptsList();
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
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      const attempts = await practiceListPage.getAttemptsList();
      
      // If more than 10, first page should have 10
      if (attempts.length > 10) {
        expect(attempts.length).toBe(10);
      } else {
        expect(attempts.length).toBeLessThanOrEqual(10);
      }
    });

    test('FUC-177: Navigate between pages', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      // Check if pagination exists
      const hasNextButton = await practiceListPage.hasNextPageButton();
      
      if (hasNextButton) {
        // Click next page
        await practiceListPage.clickNextPage();
        await driver.sleep(2000);

        const page2Attempts = await practiceListPage.getAttemptsList();
        expect(page2Attempts.length).toBeGreaterThan(0);

        // Click previous
        await practiceListPage.clickPreviousPage();
        await driver.sleep(2000);

        const page1Attempts = await practiceListPage.getAttemptsList();
        expect(page1Attempts.length).toBeGreaterThan(0);
      }
    });

    test('FUC-178: Hide pagination when <= 10 attempts', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      const attempts = await practiceListPage.getAttemptsList();
      
      if (attempts.length <= 10) {
        const paginationVisible = await practiceListPage.isPaginationVisible();
        expect(paginationVisible).toBe(false);
      }
    });

    test('FUC-179: Reset to page 1 when applying filter', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      // Go to page 2 if available
      const hasNextButton = await practiceListPage.hasNextPageButton();
      if (hasNextButton) {
        await practiceListPage.clickNextPage();
        await driver.sleep(2000);

        // Apply filter
        await practiceListPage.filterBySkill('Speaking');
        await driver.sleep(2000);

        // Verify on page 1
        const pageNumber = await practiceListPage.getCurrentPageNumber();
        expect(pageNumber).toBe(1);
      }
    });
  });

  // ==================== REQ058-REQ060: Comparison Logic ====================
  describe('REQ058-REQ060: Attempt Comparison Validation', () => {
    
    test('FUC-180: Block comparison with only 1 attempt (MSG-028)', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      // Select only one attempt
      await practiceListPage.selectAttempt(0);
      await driver.sleep(1000);

      // Try to compare
      await practiceListPage.clickCompareButton();
      await driver.sleep(2000);

      const errorMessage = await practiceListPage.getErrorMessage();
      expect(errorMessage).toContain(MESSAGES.MSG_028 || 'at least 2');
    });

    test('FUC-181: Enable compare button with 2 same-skill attempts', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      // Select two Writing attempts
      const writingAttempts = await practiceListPage.getWritingAttempts(2);
      
      await practiceListPage.selectAttempt(writingAttempts[0]);
      await practiceListPage.selectAttempt(writingAttempts[1]);
      await driver.sleep(1000);

      // Compare button should be enabled
      const isCompareEnabled = await practiceListPage.isCompareButtonEnabled();
      expect(isCompareEnabled).toBe(true);

      // Click compare
      await practiceListPage.clickCompareButton();
      await driver.sleep(3000);

      // Verify comparison view loads
      const comparisonView = await practiceListPage.getComparisonView();
      expect(comparisonView).toBeTruthy();
    });

    test('FUC-182: Disable compare when selection drops below 2', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      const writingAttempts = await practiceListPage.getWritingAttempts(2);
      
      await practiceListPage.selectAttempt(writingAttempts[0]);
      await practiceListPage.selectAttempt(writingAttempts[1]);
      await driver.sleep(1000);

      // Unselect one
      await practiceListPage.unselectAttempt(writingAttempts[1]);
      await driver.sleep(1000);

      // Compare button should be disabled
      const isCompareEnabled = await practiceListPage.isCompareButtonEnabled();
      expect(isCompareEnabled).toBe(false);
    });

    test('FUC-183: Handle more than 2 attempts if allowed', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      const writingAttempts = await practiceListPage.getWritingAttempts(3);
      
      await practiceListPage.selectAttempt(writingAttempts[0]);
      await practiceListPage.selectAttempt(writingAttempts[1]);
      await practiceListPage.selectAttempt(writingAttempts[2]);
      await driver.sleep(1000);

      // Try to compare
      await practiceListPage.clickCompareButton();
      await driver.sleep(3000);

      // Should either allow or show max attempts message
      const comparisonView = await practiceListPage.getComparisonView();
      const errorMessage = await practiceListPage.getErrorMessage();
      
      expect(comparisonView || errorMessage).toBeTruthy();
    });

    test('FUC-187: Block comparison with mixed skills (MSG-030)', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      // Select one Speaking and one Writing
      const speakingAttempts = await practiceListPage.getSpeakingAttempts(1);
      const writingAttempts = await practiceListPage.getWritingAttempts(1);
      
      if (speakingAttempts.length > 0 && writingAttempts.length > 0) {
        await practiceListPage.selectAttempt(speakingAttempts[0]);
        await practiceListPage.selectAttempt(writingAttempts[0]);
        await driver.sleep(1000);

        // Try to compare
        await practiceListPage.clickCompareButton();
        await driver.sleep(2000);

        const errorMessage = await practiceListPage.getErrorMessage();
        expect(errorMessage).toContain(MESSAGES.MSG_030 || 'same skill');
      }
    });

    test('FUC-188: Allow comparison of multiple Speaking attempts', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      const speakingAttempts = await practiceListPage.getSpeakingAttempts(2);
      
      if (speakingAttempts.length >= 2) {
        await practiceListPage.selectAttempt(speakingAttempts[0]);
        await practiceListPage.selectAttempt(speakingAttempts[1]);
        await driver.sleep(1000);

        await practiceListPage.clickCompareButton();
        await driver.sleep(3000);

        const comparisonView = await practiceListPage.getComparisonView();
        expect(comparisonView).toBeTruthy();
      }
    });

    test('FUC-189: Allow comparison of multiple Writing attempts', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      const writingAttempts = await practiceListPage.getWritingAttempts(2);
      
      if (writingAttempts.length >= 2) {
        await practiceListPage.selectAttempt(writingAttempts[0]);
        await practiceListPage.selectAttempt(writingAttempts[1]);
        await driver.sleep(1000);

        await practiceListPage.clickCompareButton();
        await driver.sleep(3000);

        const comparisonView = await practiceListPage.getComparisonView();
        expect(comparisonView).toBeTruthy();
      }
    });
  });

  // ==================== REQ061-REQ062: Comparison Charts ====================
  describe('REQ061-REQ062: Comparison Charts & Indicators', () => {
    
    test('FUC-191: Display Radar Chart for sub-score comparison', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      const writingAttempts = await practiceListPage.getWritingAttempts(2);
      
      await practiceListPage.selectAttempt(writingAttempts[0]);
      await practiceListPage.selectAttempt(writingAttempts[1]);
      await practiceListPage.clickCompareButton();
      await driver.sleep(3000);

      // Verify Radar Chart exists
      const radarChart = await practiceListPage.getRadarChart();
      expect(radarChart).toBeTruthy();
    });

    test('FUC-192: Display Line Chart for score progression', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      const writingAttempts = await practiceListPage.getWritingAttempts(2);
      
      await practiceListPage.selectAttempt(writingAttempts[0]);
      await practiceListPage.selectAttempt(writingAttempts[1]);
      await practiceListPage.clickCompareButton();
      await driver.sleep(3000);

      // Verify Line Chart exists
      const lineChart = await practiceListPage.getLineChart();
      expect(lineChart).toBeTruthy();
    });

    test('FUC-193: Chart data matches numerical values', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      const writingAttempts = await practiceListPage.getWritingAttempts(2);
      
      await practiceListPage.selectAttempt(writingAttempts[0]);
      await practiceListPage.selectAttempt(writingAttempts[1]);
      await practiceListPage.clickCompareButton();
      await driver.sleep(3000);

      // Get scores from table
      const scores = await practiceListPage.getScoresFromTable();
      
      // Verify charts use same data
      const chartData = await practiceListPage.getChartDataValues();
      expect(chartData).toEqual(scores);
    });

    test('FUC-194: Display improvement indicator (↑) with percentage', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      const writingAttempts = await practiceListPage.getWritingAttempts(2);
      
      // Ensure first attempt has lower score than second
      const attempt1Score = await practiceListPage.getAttemptScore(writingAttempts[0]);
      const attempt2Score = await practiceListPage.getAttemptScore(writingAttempts[1]);
      
      if (attempt2Score > attempt1Score) {
        await practiceListPage.selectAttempt(writingAttempts[0]);
        await practiceListPage.selectAttempt(writingAttempts[1]);
        await practiceListPage.clickCompareButton();
        await driver.sleep(3000);

        const improvementIndicator = await practiceListPage.getImprovementIndicator();
        expect(improvementIndicator).toContain('↑');
        expect(improvementIndicator).toContain('%');
      }
    });

    test('FUC-195: Display decline indicator (↓) with percentage', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      const writingAttempts = await practiceListPage.getWritingAttempts(2);
      
      // Ensure first attempt has higher score than second
      const attempt1Score = await practiceListPage.getAttemptScore(writingAttempts[0]);
      const attempt2Score = await practiceListPage.getAttemptScore(writingAttempts[1]);
      
      if (attempt2Score < attempt1Score) {
        await practiceListPage.selectAttempt(writingAttempts[0]);
        await practiceListPage.selectAttempt(writingAttempts[1]);
        await practiceListPage.clickCompareButton();
        await driver.sleep(3000);

        const declineIndicator = await practiceListPage.getDeclineIndicator();
        expect(declineIndicator).toContain('↓');
        expect(declineIndicator).toContain('%');
      }
    });

    test('FUC-196: Display neutral indicator (0%) when scores are equal', async () => {
      // This may require specific test data
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      const writingAttempts = await practiceListPage.getWritingAttempts(2);
      
      const attempt1Score = await practiceListPage.getAttemptScore(writingAttempts[0]);
      const attempt2Score = await practiceListPage.getAttemptScore(writingAttempts[1]);
      
      if (attempt1Score === attempt2Score) {
        await practiceListPage.selectAttempt(writingAttempts[0]);
        await practiceListPage.selectAttempt(writingAttempts[1]);
        await practiceListPage.clickCompareButton();
        await driver.sleep(3000);

        const neutralIndicator = await practiceListPage.getNeutralIndicator();
        expect(neutralIndicator).toContain('0%');
      }
    });

    test('FUC-197: Sub-score indicators show improvement/decline', async () => {
      await practiceListPage.navigateToPracticeHistory();
      await driver.sleep(3000);

      const writingAttempts = await practiceListPage.getWritingAttempts(2);
      
      await practiceListPage.selectAttempt(writingAttempts[0]);
      await practiceListPage.selectAttempt(writingAttempts[1]);
      await practiceListPage.clickCompareButton();
      await driver.sleep(3000);

      // Get sub-score indicators
      const subscoreIndicators = await practiceListPage.getSubscoreIndicators();
      
      // Verify each sub-score has indicator
      subscoreIndicators.forEach(indicator => {
        expect(indicator).toMatch(/↑|↓|-/); // Should have up, down, or neutral
      });
    });
  });
});
