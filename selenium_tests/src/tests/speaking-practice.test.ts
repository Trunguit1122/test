import { WebDriver } from 'selenium-webdriver';
import { SpeakingPracticePage } from '../pages/SpeakingPracticePage';
import { SignInPage } from '../pages/SignInPage';
import { PracticeListPage } from '../pages/PracticeListPage';
import { ResultPage } from '../pages/ResultPage';
import { setupDriver, teardownDriver } from '../utils/setup';
import { TEST_USERS } from '../utils/testData';
import { MESSAGES } from '../config/messages';

describe('Speaking Practice Tests (REQ020-REQ029)', () => {
    let driver: WebDriver;
    let speakingPage: SpeakingPracticePage;
    let signInPage: SignInPage;
    let practiceListPage: PracticeListPage;
    let resultPage: ResultPage;

    beforeAll(async () => {
        driver = await setupDriver();
    });

    afterAll(async () => {
        await teardownDriver(driver);
    });

    beforeEach(async () => {
        speakingPage = new SpeakingPracticePage(driver);
        signInPage = new SignInPage(driver);
        practiceListPage = new PracticeListPage(driver);
        resultPage = new ResultPage(driver);
        await signInPage.navigate();
        await signInPage.login(TEST_USERS.learner.email, TEST_USERS.learner.password);
    });

    // REQ020 - Session Creation & ID Generation
    describe('REQ020: Session Creation', () => {
        
        test('FUC-066: Verify Session Creation & ID Generation', async () => {
            await practiceListPage.navigate();
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(2000);
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toContain('/preparation');
            const sessionIdMatch = currentUrl.match(/\/session\/([a-zA-Z0-9-]+)/);
            expect(sessionIdMatch).toBeTruthy();
        });

        test('FUC-067: Verify Double-Click Prevention (Uniqueness)', async () => {
            await practiceListPage.navigate();
            await practiceListPage.doubleClickStartOnFirstPrompt();
            await driver.sleep(3000);
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toContain('/preparation');
        });
    });

    // REQ021 - Preparation Timer & Skip Restriction
    describe('REQ021: Preparation Timer', () => {
        
        beforeEach(async () => {
            await practiceListPage.navigate();
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(2000);
        });

        test('FUC-069: Verify Preparation Timer & Skip Restriction', async () => {
            const initialTimerValue = await speakingPage.getPreparationTimerValue();
            expect(initialTimerValue).toMatch(/01:00|60/);
            
            const isSkipButtonEnabled = await speakingPage.isSkipButtonEnabled();
            expect(isSkipButtonEnabled).toBe(false);
            await driver.sleep(5000);
            const isSkipButtonEnabledAfter5s = await speakingPage.isSkipButtonEnabled();
            expect(isSkipButtonEnabledAfter5s).toBe(true);
        });

        test('FUC-070: Verify Manual Skip Action', async () => {
            await driver.sleep(5000);
            await speakingPage.clickSkipButton();
            await driver.sleep(2000);
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toContain('/recording');
        });

        test('FUC-071: Verify Auto-Skip on Timeout (60s)', async () => {
            await driver.sleep(61000);
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toContain('/recording');
        }, 70000); // Increase test timeout
    });

    // REQ023 - Min Duration Constraint
    describe('REQ023: Recording Duration Constraint', () => {
        
        beforeEach(async () => {
            await practiceListPage.navigate();
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(5000); // Wait for skip enabled
            await speakingPage.clickSkipButton();
            await driver.sleep(2000);
        });

        test('FUC-075: Verify Min Duration Constraint (Negative Case)', async () => {
            await speakingPage.clickStartRecording();
            await driver.sleep(5000);
            await speakingPage.clickStopRecording();
            const errorMessage = await speakingPage.getErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_013);
        });

        test('FUC-076: Verify Valid Duration (Positive Case)', async () => {
            await speakingPage.clickStartRecording();
            await driver.sleep(31000);
            await speakingPage.clickStopRecording();
            const isPreviewVisible = await speakingPage.isAudioPreviewVisible();
            expect(isPreviewVisible).toBe(true);
            
            const errorExists = await speakingPage.hasErrorMessage();
            expect(errorExists).toBe(false);
        }, 40000); // Increase test timeout
    });

    // REQ024 - Recorded File Extension
    describe('REQ024: File Extension Validation', () => {
        
        test('FUC-077: Verify Recorded File Extension', async () => {
            await practiceListPage.navigate();
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(5000);
            await speakingPage.clickSkipButton();
            await driver.sleep(2000);
            await speakingPage.clickStartRecording();
            await driver.sleep(31000);
            await speakingPage.clickStopRecording();
            await driver.sleep(2000);
            const audioSrc = await speakingPage.getAudioFileSrc();
            const hasValidExtension = audioSrc.endsWith('.wav') || audioSrc.endsWith('.mp3');
            expect(hasValidExtension).toBe(true);
        }, 50000);
    });

    // REQ025 - Rename Recording
    describe('REQ025: Rename Recording', () => {
        
        beforeEach(async () => {
            await practiceListPage.navigate();
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(5000);
            await speakingPage.clickSkipButton();
            await driver.sleep(2000);
            await speakingPage.clickStartRecording();
            await driver.sleep(31000);
            await speakingPage.clickStopRecording();
            await driver.sleep(2000);
        }, 50000);

        test('FUC-078: Verify Rename - Invalid Special Characters', async () => {
            await speakingPage.clickRenameRecording();
            await speakingPage.enterNewRecordingName('Audio@#$');
            await speakingPage.clickSaveRename();
            const errorMessage = await speakingPage.getErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_014);
        }, 50000);

        test('FUC-079: Verify Rename - Max Length Exceeded', async () => {
            const longName = 'a'.repeat(51);
            await speakingPage.clickRenameRecording();
            await speakingPage.enterNewRecordingName(longName);
            await speakingPage.clickSaveRename();
            const errorMessage = await speakingPage.getErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_014);
        }, 50000);

        test('FUC-080: Verify Rename - Valid Format', async () => {
            await speakingPage.clickRenameRecording();
            await speakingPage.enterNewRecordingName('Final-Test_01');
            await speakingPage.clickSaveRename();
            const recordingName = await speakingPage.getRecordingName();
            expect(recordingName).toBe('Final-Test_01');
        }, 50000);
    });

    // REQ026 - Delete Recording
    describe('REQ026: Delete Recording', () => {
        
        test('FUC-081: Verify Delete Recording', async () => {
            await practiceListPage.navigate();
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(5000);
            await speakingPage.clickSkipButton();
            await driver.sleep(2000);
            await speakingPage.clickStartRecording();
            await driver.sleep(31000);
            await speakingPage.clickStopRecording();
            await driver.sleep(2000);
            const initialCount = await speakingPage.getRecordingCount();
            await speakingPage.clickDeleteFirstRecording();
            await speakingPage.confirmDelete();
            await driver.sleep(1000);
            const newCount = await speakingPage.getRecordingCount();
            expect(newCount).toBe(initialCount - 1);
        }, 50000);
    });

    // REQ027 - Submit with Empty List
    describe('REQ027: Submit Validation', () => {
        
        test('FUC-082: Verify Submit with Empty List (Negative)', async () => {
            await practiceListPage.navigate();
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(5000);
            await speakingPage.clickSkipButton();
            await driver.sleep(2000);
            await speakingPage.clickSubmitButton();
            await driver.sleep(1000);
            const errorMessage = await speakingPage.getToastErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_015);
        });

        test('FUC-083: Verify Submit With Recording', async () => {
            await practiceListPage.navigate();
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(5000);
            await speakingPage.clickSkipButton();
            await driver.sleep(2000);
            await speakingPage.clickStartRecording();
            await driver.sleep(31000);
            await speakingPage.clickStopRecording();
            await driver.sleep(2000);
            await speakingPage.clickSubmitButton();
            await driver.sleep(1000);
            const hasError = await speakingPage.hasToastError();
            expect(hasError).toBe(false);
        }, 50000);
    });

    // REQ028 - Loading State UI
    describe('REQ028: Loading State', () => {
        
        test('FUC-084: Verify Loading State UI', async () => {
            await practiceListPage.navigate();
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(5000);
            await speakingPage.clickSkipButton();
            await driver.sleep(2000);
            await speakingPage.clickStartRecording();
            await driver.sleep(31000);
            await speakingPage.clickStopRecording();
            await driver.sleep(2000);
            await speakingPage.clickSubmitButton();
            const isButtonDisabled = await speakingPage.isSubmitButtonDisabled();
            expect(isButtonDisabled).toBe(true);
            const isSpinnerVisible = await speakingPage.isLoadingSpinnerVisible();
            expect(isSpinnerVisible).toBe(true);
        }, 50000);
    });

    // REQ029 - Result Data Display
    describe('REQ029: Result Display', () => {
        
        test('FUC-085: Verify Result Data Display', async () => {
            await practiceListPage.navigate();
            await practiceListPage.clickStartOnFirstPrompt();
            await driver.sleep(5000);
            await speakingPage.clickSkipButton();
            await driver.sleep(2000);
            await speakingPage.clickStartRecording();
            await driver.sleep(31000);
            await speakingPage.clickStopRecording();
            await driver.sleep(2000);
            await speakingPage.clickSubmitButton();
            await driver.sleep(30000);
            const isResultVisible = await resultPage.isResultModalVisible();
            expect(isResultVisible).toBe(true);
            const scoreValue = await resultPage.getScoreValue();
            expect(scoreValue).toBeTruthy();
            const grammarFeedback = await resultPage.getGrammarFeedback();
            const vocabFeedback = await resultPage.getVocabFeedback();
            const pronunciationFeedback = await resultPage.getPronunciationFeedback();
            
            expect(grammarFeedback).toBeTruthy();
            expect(vocabFeedback).toBeTruthy();
            expect(pronunciationFeedback).toBeTruthy();
        }, 90000);
    });
});
