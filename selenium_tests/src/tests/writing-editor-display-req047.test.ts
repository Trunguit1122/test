import { WebDriver } from 'selenium-webdriver';
import { WritingPracticePage } from '../pages/WritingPracticePage';
import { SignInPage } from '../pages/SignInPage';
import { PracticeListPage } from '../pages/PracticeListPage';
import { setupDriver, teardownDriver } from '../utils/setup';
import { TEST_USERS } from '../utils/testData';

/**
 * Writing Editor Display Tests (REQ047)
 * Test Cases: FUC-145 to FUC-147
 */
describe('REQ047: Writing Editor Display Elements', () => {
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
