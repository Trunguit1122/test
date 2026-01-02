import { WebDriver } from 'selenium-webdriver';
import { DashboardPage } from '../pages/DashboardPage';
import { SignInPage } from '../pages/SignInPage';
import { PracticeListPage } from '../pages/PracticeListPage';
import { setupDriver, teardownDriver } from '../utils/setup';
import { TEST_USERS } from '../utils/testData';
import { ROUTES } from '../config/routes';

describe('Practice Navigation Tests (REQ015-REQ017)', () => {
    let driver: WebDriver;
    let dashboardPage: DashboardPage;
    let signInPage: SignInPage;
    let practiceListPage: PracticeListPage;

    beforeAll(async () => {
        driver = await setupDriver();
    });

    afterAll(async () => {
        await teardownDriver(driver);
    });

    beforeEach(async () => {
        dashboardPage = new DashboardPage(driver);
        signInPage = new SignInPage(driver);
        practiceListPage = new PracticeListPage(driver);
        
        await signInPage.navigate();
        await signInPage.login(TEST_USERS.learner.email, TEST_USERS.learner.password);
        await dashboardPage.navigate();
    });

    // REQ015 - Navigation to Practice Pages
    describe('REQ015: Practice Page Navigation', () => {
        
        test('FUC-058: Verify Navigation to Speaking Practice', async () => {
            await dashboardPage.clickSpeakingPractice();
            await driver.sleep(2000);
            
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toContain(ROUTES.SPEAKING_PRACTICE);
        });

        test('FUC-059: Verify Navigation to Writing Practice', async () => {
            await dashboardPage.clickWritingPractice();
            await driver.sleep(2000);
            
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toContain(ROUTES.WRITING_PRACTICE);
        });
    });

    // REQ017 - Filter Prompts by Topic and Difficulty
    describe('REQ017: Filter Prompts', () => {
        
        beforeEach(async () => {
            await dashboardPage.clickSpeakingPractice();
            await driver.sleep(1000);
        });

        test('FUC-060: Verify Filter by Topic', async () => {
            await practiceListPage.selectTopic('Education');
            await driver.sleep(1000);
            
            const allItemsHaveTopic = await practiceListPage.verifyAllItemsHaveTopic('Education');
            expect(allItemsHaveTopic).toBe(true);
        });

        test('FUC-061: Verify Filter by Difficulty', async () => {
            await practiceListPage.selectDifficulty('Hard');
            await driver.sleep(1000);
            
            const allItemsHaveDifficulty = await practiceListPage.verifyAllItemsHaveDifficulty('Hard');
            expect(allItemsHaveDifficulty).toBe(true);
        });

        test('FUC-062: Verify Combined Filter (Topic + Difficulty)', async () => {
            await practiceListPage.selectTopic('Environment');
            await practiceListPage.selectDifficulty('Medium');
            await driver.sleep(1000);
            
            const allItemsMatch = await practiceListPage.verifyAllItemsMatchFilter('Environment', 'Medium');
            expect(allItemsMatch).toBe(true);
        });
    });

    // REQ018 - Search Prompts by Keyword
    describe('REQ018: Search Prompts', () => {
        
        beforeEach(async () => {
            await dashboardPage.clickSpeakingPractice();
            await driver.sleep(1000);
        });

        test('FUC-063: Verify Search with Short Keyword (< 3 chars)', async () => {
            await practiceListPage.enterSearchKeyword('Hi');
            
            const isSearchButtonEnabled = await practiceListPage.isSearchButtonEnabled();
            expect(isSearchButtonEnabled).toBe(false);
        });

        test('FUC-064: Verify Search with Valid Keyword (>= 3 chars)', async () => {
            await practiceListPage.enterSearchKeyword('Edu');
            await practiceListPage.clickSearchButton();
            await driver.sleep(1000);
            
            const searchResults = await practiceListPage.getSearchResults();
            expect(searchResults.length).toBeGreaterThan(0);
            
            const allResultsMatch = searchResults.every(result => 
                result.toLowerCase().includes('edu')
            );
            expect(allResultsMatch).toBe(true);
        });
    });

    // REQ019 - Default Sorting Order
    describe('REQ019: Default Sorting Order', () => {
        
        test('FUC-065: Verify Default Sorting Order (Newest First)', async () => {
            await dashboardPage.clickSpeakingPractice();
            await driver.sleep(1000);
            
            const displayedDates = await practiceListPage.getPromptDates();
            
            for (let i = 0; i < displayedDates.length - 1; i++) {
                const date1 = new Date(displayedDates[i]);
                const date2 = new Date(displayedDates[i + 1]);
                expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
            }
        });
    });
});
