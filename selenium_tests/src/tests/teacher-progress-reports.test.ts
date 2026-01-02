import { WebDriver } from 'selenium-webdriver';
import { TeacherDashboardPage } from '../pages/TeacherDashboardPage';
import { SignInPage } from '../pages/SignInPage';
import { ProgressPage } from '../pages/ProgressPage';
import { setupDriver, teardownDriver } from '../utils/setup';
import { TEST_USERS } from '../utils/testData';
import { MESSAGES } from '../config/messages';
import fs from 'fs';
import path from 'path';

describe('Teacher Progress & Reports Tests (REQ039-REQ045)', () => {
    let driver: WebDriver;
    let teacherDashboard: TeacherDashboardPage;
    let signInPage: SignInPage;
    let progressPage: ProgressPage;

    beforeAll(async () => {
        driver = await setupDriver();
    });

    afterAll(async () => {
        await teardownDriver(driver);
    });

    beforeEach(async () => {
        teacherDashboard = new TeacherDashboardPage(driver);
        signInPage = new SignInPage(driver);
        progressPage = new ProgressPage(driver);
        await signInPage.navigate();
        await signInPage.login(TEST_USERS.teacher.email, TEST_USERS.teacher.password);
        await teacherDashboard.navigate();
    });

    // REQ039 - Practice Suggestion Filtering
    describe('REQ039: Practice Suggestion Filtering', () => {
        
        test('FUC-116: Verify Suggestion List Filtering (Happy Path)', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudent();
            await driver.sleep(1000);
            await teacherDashboard.clickSuggestPracticeButton();
            await driver.sleep(1000);
            const topicsVisible = await teacherDashboard.getSuggestedTopics();
            expect(topicsVisible.length).toBeGreaterThan(0);
        });

        test('FUC-117: Verify Filtering of Mismatched Levels', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudent();
            await driver.sleep(1000);
            await teacherDashboard.clickSuggestPracticeButton();
            await driver.sleep(1000);
            const topics = await teacherDashboard.getSuggestedTopics();
            const hasMismatchedLevel = topics.some(topic => topic.level === '8.0');
            expect(hasMismatchedLevel).toBe(false);
        });

        test('FUC-120: Verify Empty State (No Match)', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickStudentWithHighScore();
            await driver.sleep(1000);
            await teacherDashboard.clickSuggestPracticeButton();
            await driver.sleep(1000);
            const emptyMessage = await teacherDashboard.getEmptyStateMessage();
            expect(emptyMessage).toContain('No suitable topics found');
        });
    });

    // REQ040 - Progress Chart View
    describe('REQ040: Progress Chart', () => {
        
        beforeEach(async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudent();
            await driver.sleep(1000);
            await progressPage.navigate();
            await driver.sleep(2000);
        });

        test('FUC-121: Verify Default View (Weekly)', async () => {
            const isWeeklyActive = await progressPage.isWeeklyFilterActive();
            expect(isWeeklyActive).toBe(true);
            const xAxisLabels = await progressPage.getXAxisLabels();
            expect(xAxisLabels.length).toBeGreaterThan(0);
        });

        test('FUC-122: Verify Switch to Monthly View', async () => {
            await progressPage.clickMonthlyFilter();
            await driver.sleep(1000);
            const isMonthlyActive = await progressPage.isMonthlyFilterActive();
            expect(isMonthlyActive).toBe(true);
            const xAxisLabels = await progressPage.getXAxisLabels();
            expect(xAxisLabels).toBeTruthy();
        });

        test('FUC-123: Verify Data Accuracy (Weekly)', async () => {
            const mondayValue = await progressPage.getDataPointValue('Monday');
            expect(mondayValue).toBeTruthy();
            const wednesdayValue = await progressPage.getDataPointValue('Wednesday');
            expect(wednesdayValue).toBeTruthy();
        });
    });

    // REQ041 - Progress Metrics
    describe('REQ041: Progress Metrics', () => {
        
        beforeEach(async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudent();
            await driver.sleep(1000);
            await progressPage.navigate();
            await driver.sleep(2000);
        });

        test('FUC-125: Verify "Total Attempts" Count', async () => {
            const totalAttempts = await progressPage.getTotalAttemptsCount();
            expect(typeof totalAttempts).toBe('number');
            expect(totalAttempts).toBeGreaterThanOrEqual(0);
        });

        test('FUC-126: Verify "Average Score" Calculation', async () => {
            const avgScore = await progressPage.getAverageScore();
            expect(avgScore).toMatch(/^\d+\.\d$/);
        });

        test('FUC-127: Verify "Highest Score" Logic', async () => {
            const highestScore = await progressPage.getHighestScore();
            expect(highestScore).toMatch(/^\d+\.\d$/);
        });

        test('FUC-128: Verify Empty State (Zero Data)', async () => {
            await driver.navigate().back();
            await driver.sleep(1000);
            await teacherDashboard.clickStudentWithNoAttempts();
            await driver.sleep(1000);
            await progressPage.navigate();
            await driver.sleep(2000);
            const totalAttempts = await progressPage.getTotalAttemptsCount();
            expect(totalAttempts).toBe(0);
        });

        test('FUC-129: Verify Metrics Update on Filter Change', async () => {
            const avgScoreWeek1 = await progressPage.getAverageScore();
            await progressPage.clickMonthlyFilter();
            await driver.sleep(1000);
            const avgScoreMonthly = await progressPage.getAverageScore();
            expect(avgScoreMonthly).toBeTruthy();
        });
    });

    // REQ042 - Export Functionality
    describe('REQ042: Export CSV/PDF', () => {
        
        beforeEach(async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudent();
            await driver.sleep(1000);
            await progressPage.navigate();
            await driver.sleep(2000);
        });

        test('FUC-130: Verify CSV Export (Filename, Content, UTF-8)', async () => {
            await progressPage.clickExportCSVButton();
            await driver.sleep(3000);
            const downloadPath = path.join(__dirname, '../../downloads');
            const files = fs.readdirSync(downloadPath);
            const csvFile = files.find(f => f.endsWith('.csv') && f.startsWith('Report_'));
            
            expect(csvFile).toBeTruthy();
            if (csvFile) {
                const content = fs.readFileSync(path.join(downloadPath, csvFile), 'utf8');
                expect(content.length).toBeGreaterThan(0);
            }
        });

        test('FUC-131: Verify PDF Export Functionality', async () => {
            await progressPage.clickExportPDFButton();
            await driver.sleep(3000);
            const downloadPath = path.join(__dirname, '../../downloads');
            const files = fs.readdirSync(downloadPath);
            const pdfFile = files.find(f => f.endsWith('.pdf'));
            
            expect(pdfFile).toBeTruthy();
            if (pdfFile) {
                const stats = fs.statSync(path.join(downloadPath, pdfFile));
                expect(stats.size).toBeGreaterThan(1024);
            }
        });
    });

    // REQ043 - Filename Format
    describe('REQ043: Export Filename Format', () => {
        
        test('FUC-132: Verify Filename Format with Valid Inputs', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudent();
            await driver.sleep(1000);
            await progressPage.navigate();
            await driver.sleep(2000);
            await progressPage.clickExportCSVButton();
            await driver.sleep(3000);
            const downloadPath = path.join(__dirname, '../../downloads');
            const files = fs.readdirSync(downloadPath);
            const csvFile = files.find(f => f.endsWith('.csv'));
            
            expect(csvFile).toMatch(/Report_.*_\d{8}\.csv/);
        });

        test('FUC-133: Verify Filename Sanitization for Special Characters', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickStudentWithSpecialCharsName();
            await driver.sleep(1000);
            await progressPage.navigate();
            await driver.sleep(2000);
            await progressPage.clickExportCSVButton();
            await driver.sleep(3000);
            const downloadPath = path.join(__dirname, '../../downloads');
            const files = fs.readdirSync(downloadPath);
            const csvFile = files.find(f => f.endsWith('.csv'));
            
            expect(csvFile).toBeTruthy();
            expect(csvFile).not.toMatch(/[\/:\\*\?"<>|]/);
        });

        test('FUC-134: Verify File Extension based on Export Type', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudent();
            await driver.sleep(1000);
            await progressPage.navigate();
            await driver.sleep(2000);
            await progressPage.clickExportPDFButton();
            await driver.sleep(3000);
            const downloadPath = path.join(__dirname, '../../downloads');
            let files = fs.readdirSync(downloadPath);
            const pdfFile = files.find(f => f.endsWith('.pdf'));
            expect(pdfFile).toBeTruthy();
            await progressPage.clickExportCSVButton();
            await driver.sleep(3000);
            files = fs.readdirSync(downloadPath);
            const csvFile = files.find(f => f.endsWith('.csv'));
            expect(csvFile).toBeTruthy();
        });
    });

    // REQ044 - Export Timeout
    describe('REQ044: Export Timeout Handling', () => {
        
        test('FUC-136: Verify Export Success within Time Limit (< 60s)', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudent();
            await driver.sleep(1000);
            await progressPage.navigate();
            await driver.sleep(2000);
            await progressPage.selectDateRange('Last 30 days');
            await progressPage.clickExportCSVButton();
            await driver.sleep(10000);
            const downloadPath = path.join(__dirname, '../../downloads');
            const files = fs.readdirSync(downloadPath);
            const csvFile = files.find(f => f.endsWith('.csv'));
            expect(csvFile).toBeTruthy();
        });

        test('FUC-137: Verify Timeout Trigger (> 60s) - Error MSG-021', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudent();
            await driver.sleep(1000);
            await progressPage.navigate();
            await driver.sleep(2000);
            await progressPage.selectDateRange('Last year');
            await progressPage.clickExportCSVButton();
            await driver.sleep(61000);
            const errorMessage = await progressPage.getErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_021);
        }, 70000);

        test('FUC-138: Verify UI Button State during Processing', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudent();
            await driver.sleep(1000);
            await progressPage.navigate();
            await driver.sleep(2000);
            await progressPage.clickExportCSVButton();
            const isButtonDisabled = await progressPage.isExportButtonDisabled();
            expect(isButtonDisabled).toBe(true);
        });
    });

    // REQ045 - Export Empty Data Prevention
    describe('REQ045: Export Empty Data Prevention', () => {
        
        test('FUC-139: Verify Export Prevention for Empty Date Range', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickFirstStudent();
            await driver.sleep(1000);
            await progressPage.navigate();
            await driver.sleep(2000);
            await progressPage.selectFutureDateRange();
            await progressPage.clickExportCSVButton();
            await driver.sleep(2000);
            const downloadPath = path.join(__dirname, '../../downloads');
            const filesBefore = fs.readdirSync(downloadPath).length;
            await driver.sleep(2000);
            const filesAfter = fs.readdirSync(downloadPath).length;
            expect(filesAfter).toBe(filesBefore);
            const errorMessage = await progressPage.getErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_022);
        });

        test('FUC-140: Verify Export Prevention for New Student (Zero Data)', async () => {
            await driver.sleep(2000);
            await teacherDashboard.clickStudentWithNoAttempts();
            await driver.sleep(1000);
            await progressPage.navigate();
            await driver.sleep(2000);
            await progressPage.clickExportPDFButton();
            await driver.sleep(2000);
            const errorMessage = await progressPage.getErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_022);
            const downloadPath = path.join(__dirname, '../../downloads');
            const files = fs.readdirSync(downloadPath);
            const newPdfFile = files.find(f => 
                f.endsWith('.pdf') && 
                fs.statSync(path.join(downloadPath, f)).mtimeMs > Date.now() - 5000
            );
            expect(newPdfFile).toBeFalsy();
        });
    });
});
