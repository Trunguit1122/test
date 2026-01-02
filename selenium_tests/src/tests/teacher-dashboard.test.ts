import { WebDriver } from 'selenium-webdriver';
import { TeacherDashboardPage } from '../pages/TeacherDashboardPage';
import { SignInPage } from '../pages/SignInPage';
import { PracticeHistoryPage } from '../pages/PracticeHistoryPage';
import { setupDriver, teardownDriver } from '../utils/setup';
import { TEST_USERS } from '../utils/testData';
import { MESSAGES } from '../config/messages';

describe('Teacher Dashboard Tests (REQ030-REQ038)', () => {
    let driver: WebDriver;
    let teacherDashboard: TeacherDashboardPage;
    let signInPage: SignInPage;
    let historyPage: PracticeHistoryPage;

    beforeAll(async () => {
        driver = await setupDriver();
    });

    afterAll(async () => {
        await teardownDriver(driver);
    });

    beforeEach(async () => {
        teacherDashboard = new TeacherDashboardPage(driver);
        signInPage = new SignInPage(driver);
        historyPage = new PracticeHistoryPage(driver);
        await signInPage.navigate();
        await signInPage.login(TEST_USERS.teacher.email, TEST_USERS.teacher.password);
        await teacherDashboard.navigate();
    });

    // REQ030 - Default Page Layout & Controls
    describe('REQ030: Student List Pagination', () => {
        
        test('FUC-086: Verify Default Page Layout & Controls', async () => {
            await driver.sleep(2000);
            const rowCount = await teacherDashboard.getStudentRowCount();
            expect(rowCount).toBeLessThanOrEqual(50);
            const isPrevDisabled = await teacherDashboard.isPreviousButtonDisabled();
            expect(isPrevDisabled).toBe(true);
            const isNextEnabled = await teacherDashboard.isNextButtonEnabled();
            expect(isNextEnabled).toBeDefined();
        });

        test('FUC-087: Verify Navigation Flow (Next & Prev)', async () => {
            await driver.sleep(2000);
            const firstRowId = await teacherDashboard.getFirstStudentId();
            await teacherDashboard.clickNextButton();
            await driver.sleep(1000);
            const secondPageFirstId = await teacherDashboard.getFirstStudentId();
            expect(secondPageFirstId).not.toBe(firstRowId);
            const pageNumber = await teacherDashboard.getCurrentPageNumber();
            expect(pageNumber).toBe(2);
            await teacherDashboard.clickPreviousButton();
            await driver.sleep(1000);
            const backToPageOne = await teacherDashboard.getCurrentPageNumber();
            expect(backToPageOne).toBe(1);
        });
    });

    // REQ032 - Filter Application
    describe('REQ032: Student List Filtering', () => {
        
        test('FUC-090: Verify Single Filter Application (Group)', async () => {
            await driver.sleep(2000);
            await teacherDashboard.selectGroupFilter('Class 1');
            await driver.sleep(1000);
            const allHaveGroup = await teacherDashboard.verifyAllStudentsHaveGroup('Class 1');
            expect(allHaveGroup).toBe(true);
        });

        test('FUC-091: Verify AND Logic - Positive Match', async () => {
            await driver.sleep(2000);
            await teacherDashboard.selectGroupFilter('Class 1');
            await teacherDashboard.selectStatusFilter('Active');
            await driver.sleep(1000);
            const allMatch = await teacherDashboard.verifyAllStudentsMatchFilter('Class 1', 'Active');
            expect(allMatch).toBe(true);
        });

        test('FUC-094: Verify Interaction: Filters + Search (Triple AND)', async () => {
            await driver.sleep(2000);
            await teacherDashboard.selectGroupFilter('Class 1');
            await teacherDashboard.enterSearchKeyword('Minh');
            await driver.sleep(1000);
            const results = await teacherDashboard.getFilteredStudents();
            
            results.forEach(student => {
                expect(student.group).toBe('Class 1');
                expect(student.name.toLowerCase()).toContain('minh');
            });
        });
    });

    // REQ034 - History Sort Order
    describe('REQ034: Practice History Sort', () => {
        
        test('FUC-095: Verify Default Sort Order (Date)', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudentHistory();
            await driver.sleep(2000);
            const dates = await historyPage.getAllAttemptDates();
            for (let i = 0; i < dates.length - 1; i++) {
                const date1 = new Date(dates[i]);
                const date2 = new Date(dates[i + 1]);
                expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
            }
        });

        test('FUC-096: Verify Sort Order Same Day (Time Check)', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudentHistory();
            await driver.sleep(2000);
            const timestamps = await historyPage.getAllAttemptTimestamps();
            for (let i = 0; i < timestamps.length - 1; i++) {
                const time1 = new Date(timestamps[i]).getTime();
                const time2 = new Date(timestamps[i + 1]).getTime();
                expect(time1).toBeGreaterThanOrEqual(time2);
            }
        });
    });

    // REQ035 - Feedback Components Display
    describe('REQ035: Feedback Display', () => {
        
        test('FUC-100: Verify Presence of All Feedback Components', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudentHistory();
            await driver.sleep(2000);
            await historyPage.clickFirstAttempt();
            await driver.sleep(2000);
            const scoreExists = await historyPage.isScoreElementVisible();
            expect(scoreExists).toBe(true);
            const feedbackExists = await historyPage.isFeedbackTextVisible();
            expect(feedbackExists).toBe(true);
            const timestampExists = await historyPage.isTimestampVisible();
            expect(timestampExists).toBe(true);
        });

        test('FUC-101: Verify Data Mapping Accuracy', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudentHistory();
            await driver.sleep(2000);
            await historyPage.clickFirstAttempt();
            await driver.sleep(2000);
            const scoreText = await historyPage.getScoreText();
            expect(scoreText).toMatch(/\d+\.\d/); // Matches pattern like 7.5
            const feedbackText = await historyPage.getFeedbackText();
            expect(feedbackText).toBeTruthy();
            expect(feedbackText.length).toBeGreaterThan(0);
            const timestampText = await historyPage.getTimestampText();
            expect(timestampText).toBeTruthy();
        });
    });

    // REQ036 - Manual Score Input
    describe('REQ036: Manual Scoring', () => {
        
        beforeEach(async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudentHistory();
            await driver.sleep(2000);
            await historyPage.clickFirstAttempt();
            await driver.sleep(2000);
        });

        test('FUC-104: Verify Valid Manual Score Input', async () => {
            await historyPage.enterManualScore('6.0');
            await historyPage.clickSaveScore();
            await driver.sleep(1000);
            const hasError = await historyPage.hasErrorMessage();
            expect(hasError).toBe(false);
        });

        test('FUC-105: Verify Boundary Value: Max Score (9.0)', async () => {
            await historyPage.enterManualScore('9.0');
            await historyPage.clickSaveScore();
            await driver.sleep(1000);
            const hasError = await historyPage.hasErrorMessage();
            expect(hasError).toBe(false);
        });

        test('FUC-106: Verify Invalid Score: Out of Range (> 9.0)', async () => {
            await historyPage.enterManualScore('9.5');
            await historyPage.clickSaveScore();
            await driver.sleep(1000);
            const errorMessage = await historyPage.getErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_017);
        });

        test('FUC-107: Verify Invalid Step (Non-0.5 Increment)', async () => {
            await historyPage.enterManualScore('6.3');
            await historyPage.clickSaveScore();
            await driver.sleep(1000);
            const errorMessage = await historyPage.getErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_017);
        });
    });

    // REQ037 - Teacher Comment
    describe('REQ037: Teacher Comment', () => {
        
        beforeEach(async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudentHistory();
            await driver.sleep(2000);
            await historyPage.clickFirstAttempt();
            await driver.sleep(2000);
        });

        test('FUC-108: Verify Max Length (2000 Chars)', async () => {
            const comment = 'a'.repeat(2000);
            await historyPage.enterTeacherComment(comment);
            await historyPage.clickSaveEvaluation();
            await driver.sleep(1000);
            const successMessage = await historyPage.getSuccessMessage();
            expect(successMessage).toBeTruthy();
        });

        test('FUC-109: Verify Exceed Max Length (2001 Chars)', async () => {
            const comment = 'a'.repeat(2001);
            await historyPage.enterTeacherComment(comment);
            await historyPage.clickSaveEvaluation();
            await driver.sleep(1000);
            const commentLength = await historyPage.getCommentLength();
            expect(commentLength).toBeLessThanOrEqual(2000);
        });

        test('FUC-110: Verify empty comment (Optional field)', async () => {
            await historyPage.clearTeacherComment();
            await historyPage.enterManualScore('7.0');
            await historyPage.clickSaveEvaluation();
            await driver.sleep(1000);
            const successMessage = await historyPage.getSuccessMessage();
            expect(successMessage).toBeTruthy();
        });

        test('FUC-111: Verify comment with special characters', async () => {
            const comment = 'Test @ # $ % ^ & * ( ) _ + { } [ ]';
            await historyPage.enterTeacherComment(comment);
            await historyPage.enterManualScore('7.0');
            await historyPage.clickSaveEvaluation();
            await driver.sleep(1000);
            await driver.navigate().refresh();
            await driver.sleep(2000);
            const savedComment = await historyPage.getTeacherComment();
            expect(savedComment).toBe(comment);
        });
    });

    // REQ038 - Status Update & Notification
    describe('REQ038: Evaluation Status Update', () => {
        
        test('FUC-112: Verify Status Update Logic', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudentHistory();
            await driver.sleep(2000);
            await historyPage.clickFirstAttempt();
            await driver.sleep(2000);
            await historyPage.enterManualScore('7.0');
            await historyPage.enterTeacherComment('Good work');
            await historyPage.clickSaveEvaluation();
            await driver.sleep(2000);
            const statusBadge = await historyPage.getStatusBadgeText();
            expect(statusBadge).toContain('Evaluated');
        });

        test('FUC-113: Verify Data Persistence', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudentHistory();
            await driver.sleep(2000);
            await historyPage.clickFirstAttempt();
            await driver.sleep(2000);
            await historyPage.enterManualScore('7.5');
            await historyPage.enterTeacherComment('Good');
            await historyPage.clickSaveEvaluation();
            await driver.sleep(2000);
            await driver.navigate().refresh();
            await driver.sleep(2000);
            const score = await historyPage.getManualScoreValue();
            const comment = await historyPage.getTeacherComment();
            
            expect(score).toBe('7.5');
            expect(comment).toBe('Good');
        });
    });
});
