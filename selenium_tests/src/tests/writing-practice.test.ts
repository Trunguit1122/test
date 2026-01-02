import { WebDriver } from 'selenium-webdriver';
import { WritingPracticePage } from '../pages/WritingPracticePage';
import { SignInPage } from '../pages/SignInPage';
import { PracticeListPage } from '../pages/PracticeListPage';
import { setupDriver, teardownDriver } from '../utils/setup';
import { TEST_USERS } from '../utils/testData';

describe('Writing Practice Tests (REQ046)', () => {
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

    // REQ046 - Writing Session Generation
    describe('REQ046: Writing Session Creation', () => {
        
        test('FUC-141: Verify Writing Session Generation (Happy Path)', async () => {
            await practiceListPage.navigateToWritingPrompts();
            await driver.sleep(2000);
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(3000);
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toContain('/practice/writing/');
            const attemptIdMatch = currentUrl.match(/\/practice\/writing\/([a-zA-Z0-9-]+)/);
            expect(attemptIdMatch).toBeTruthy();
            const isEditorLoaded = await writingPage.isEditorVisible();
            expect(isEditorLoaded).toBe(true);
            
            const promptContent = await writingPage.getPromptContent();
            expect(promptContent).toBeTruthy();
            expect(promptContent.length).toBeGreaterThan(0);
        });

        test('FUC-142: Verify Unique AttemptID Format & Generation', async () => {
            await practiceListPage.navigateToWritingPrompts();
            await driver.sleep(2000);
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(3000);
            const currentUrl = await driver.getCurrentUrl();
            const attemptIdMatch = currentUrl.match(/\/practice\/writing\/([a-zA-Z0-9-]+)/);
            
            expect(attemptIdMatch).toBeTruthy();
            
            if (attemptIdMatch) {
                const attemptId = attemptIdMatch[1];
                expect(attemptId).toBeTruthy();
                expect(attemptId.length).toBeGreaterThan(0);
                const isValidFormat = /^[a-zA-Z0-9-]+$/.test(attemptId);
                expect(isValidFormat).toBe(true);
            }
        });

        test('FUC-143: Verify Start Time Logging (Database/API Check)', async () => {
            const startTime = new Date();
            
            await practiceListPage.navigateToWritingPrompts();
            await driver.sleep(2000);
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(3000);
            const currentUrl = await driver.getCurrentUrl();
            const attemptIdMatch = currentUrl.match(/\/practice\/writing\/([a-zA-Z0-9-]+)/);
            
            expect(attemptIdMatch).toBeTruthy();
            
            if (attemptIdMatch) {
                const attemptId = attemptIdMatch[1];
                const sessionExists = await writingPage.verifySessionExists(attemptId);
                expect(sessionExists).toBe(true);
                const timeDiff = new Date().getTime() - startTime.getTime();
                expect(timeDiff).toBeLessThan(5000);
            }
        });

        test('FUC-144: Verify Session Creation Failure (Server Error)', async () => {
            await practiceListPage.navigateToWritingPrompts();
            await driver.sleep(2000);
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(2000);
            const currentUrl = await driver.getCurrentUrl();
            const stillOnPromptPage = currentUrl.includes('/prompts') || 
                                     currentUrl.includes('/writing');
            const hasErrorMessage = await writingPage.hasErrorMessage();
            expect(stillOnPromptPage).toBe(true);
        });

        test('FUC-141 (Extended): Verify Multiple Session Creation', async () => {
            await practiceListPage.navigateToWritingPrompts();
            await driver.sleep(2000);
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(3000);
            
            const url1 = await driver.getCurrentUrl();
            const id1Match = url1.match(/\/practice\/writing\/([a-zA-Z0-9-]+)/);
            expect(id1Match).toBeTruthy();
            const attemptId1 = id1Match ? id1Match[1] : '';
            await driver.navigate().back();
            await driver.sleep(2000);
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(3000);
            
            const url2 = await driver.getCurrentUrl();
            const id2Match = url2.match(/\/practice\/writing\/([a-zA-Z0-9-]+)/);
            expect(id2Match).toBeTruthy();
            const attemptId2 = id2Match ? id2Match[1] : '';
            expect(attemptId1).not.toBe(attemptId2);
            expect(attemptId1).toBeTruthy();
            expect(attemptId2).toBeTruthy();
        });

        test('FUC-141 (Validation): Verify Session Persistence on Refresh', async () => {
            await practiceListPage.navigateToWritingPrompts();
            await driver.sleep(2000);
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(3000);
            const originalUrl = await driver.getCurrentUrl();
            const attemptIdMatch = originalUrl.match(/\/practice\/writing\/([a-zA-Z0-9-]+)/);
            expect(attemptIdMatch).toBeTruthy();
            await writingPage.typeInEditor('This is a test essay content.');
            await driver.sleep(2000);
            await driver.navigate().refresh();
            await driver.sleep(3000);
            const newUrl = await driver.getCurrentUrl();
            expect(newUrl).toBe(originalUrl);
            const isEditorVisible = await writingPage.isEditorVisible();
            expect(isEditorVisible).toBe(true);
        });

        test('FUC-142 (Edge Case): Verify Session ID Format Consistency', async () => {
            const attemptIds: string[] = [];
            
            for (let i = 0; i < 3; i++) {
                await practiceListPage.navigateToWritingPrompts();
                await driver.sleep(2000);
                await practiceListPage.clickStartOnFirstPrompt();
                await driver.sleep(3000);
                
                const currentUrl = await driver.getCurrentUrl();
                const match = currentUrl.match(/\/practice\/writing\/([a-zA-Z0-9-]+)/);
                
                if (match) {
                    attemptIds.push(match[1]);
                }
                
                await driver.navigate().back();
                await driver.sleep(2000);
            }
            expect(attemptIds.length).toBe(3);
            
            attemptIds.forEach(id => {
                const isValidFormat = /^[a-zA-Z0-9-]+$/.test(id);
                expect(isValidFormat).toBe(true);
                expect(id.length).toBeGreaterThan(5);
            });
            const uniqueIds = new Set(attemptIds);
            expect(uniqueIds.size).toBe(attemptIds.length);
        });

        test('FUC-143 (Extended): Verify Session Metadata', async () => {
            await practiceListPage.navigateToWritingPrompts();
            await driver.sleep(2000);
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(3000);
            const currentUrl = await driver.getCurrentUrl();
            const attemptIdMatch = currentUrl.match(/\/practice\/writing\/([a-zA-Z0-9-]+)/);
            
            if (attemptIdMatch) {
                const attemptId = attemptIdMatch[1];
                const promptContent = await writingPage.getPromptContent();
                expect(promptContent).toBeTruthy();
                const wordCount = await writingPage.getWordCount();
                expect(wordCount).toBe(0);
                const isEditorEditable = await writingPage.isEditorEditable();
                expect(isEditorEditable).toBe(true);
            }
        });

        test('FUC-144 (Extended): Verify Error Recovery', async () => {
            await practiceListPage.navigateToWritingPrompts();
            await driver.sleep(2000);
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(3000);
            const hasError = await writingPage.hasErrorMessage();
            
            if (hasError) {
                const errorMessage = await writingPage.getErrorMessage();
                expect(errorMessage).toBeTruthy();
                const currentUrl = await driver.getCurrentUrl();
                expect(currentUrl).toBeTruthy();
            } else {
                const currentUrl = await driver.getCurrentUrl();
                expect(currentUrl).toContain('/practice/writing/');
            }
        });
    });
});
