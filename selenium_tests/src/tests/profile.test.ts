import { WebDriver } from 'selenium-webdriver';
import { ProfilePage } from '../pages/ProfilePage';
import { SignInPage } from '../pages/SignInPage';
import { setupDriver, teardownDriver } from '../utils/setup';
import { TEST_USERS } from '../utils/testData';
import { MESSAGES } from '../config/messages';
import path from 'path';

describe('Profile Management Tests (REQ012-REQ014)', () => {
    let driver: WebDriver;
    let profilePage: ProfilePage;
    let signInPage: SignInPage;

    beforeAll(async () => {
        driver = await setupDriver();
    });

    afterAll(async () => {
        await teardownDriver(driver);
    });

    beforeEach(async () => {
        profilePage = new ProfilePage(driver);
        signInPage = new SignInPage(driver);
        
        await signInPage.navigate();
        await signInPage.login(TEST_USERS.learner.email, TEST_USERS.learner.password);
        await profilePage.navigate();
    });

    // REQ012 - Display Name Validation
    describe('REQ012: Display Name Validation', () => {
        
        test('FUC-051: Verify Display Name Required (Empty)', async () => {
            await profilePage.clearDisplayName();
            await profilePage.clickSaveButton();
            
            const errorMessage = await profilePage.getErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_010);
        });

        test('FUC-052: Verify Display Name Max Length (>50 chars)', async () => {
            const longName = 'a'.repeat(51);
            await profilePage.setDisplayName(longName);
            await profilePage.clickSaveButton();
            
            const errorMessage = await profilePage.getErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_010);
        });

        test('FUC-053: Verify Display Name with Prohibited Words', async () => {
            const prohibitedName = 'BadWord123';
            await profilePage.setDisplayName(prohibitedName);
            await profilePage.clickSaveButton();
            
            const errorMessage = await profilePage.getErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_010);
        });
    });

    // REQ013 - Avatar Upload Constraints
    describe('REQ013: Avatar Upload Constraints', () => {
        
        test('FUC-054: Verify Avatar Constraint - Invalid File Type', async () => {
            const pdfPath = path.resolve(__dirname, '../../test-files/test_doc.pdf');
            await profilePage.uploadAvatar(pdfPath);
            await profilePage.clickSaveButton();
            
            const errorMessage = await profilePage.getErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_011);
        });

        test('FUC-055: Verify Avatar Constraint - Max File Size Exceeded', async () => {
            const largePath = path.resolve(__dirname, '../../test-files/large_photo.jpg');
            await profilePage.uploadAvatar(largePath);
            await profilePage.clickSaveButton();
            
            const errorMessage = await profilePage.getErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_011);
        });

        test('FUC-056: Verify upload with invalid file format (.txt)', async () => {
            const txtPath = path.resolve(__dirname, '../../test-files/text.txt');
            await profilePage.uploadAvatar(txtPath);
            await profilePage.clickSaveButton();
            
            const errorMessage = await profilePage.getErrorMessage();
            expect(errorMessage).toContain(MESSAGES.MSG_011);
        });
    });

    // REQ014 - Successful Profile Update
    describe('REQ014: Profile Update Success', () => {
        
        test('FUC-057: Verify Successful Profile Update', async () => {
            const newName = 'Nguyen Van A';
            const validAvatarPath = path.resolve(__dirname, '../../test-files/valid_avatar.jpg');
            
            await profilePage.setDisplayName(newName);
            await profilePage.uploadAvatar(validAvatarPath);
            await profilePage.clickSaveButton();
            
            const successMessage = await profilePage.getSuccessMessage();
            expect(successMessage).toContain(MESSAGES.MSG_018);
            
            await profilePage.navigate();
            const displayedName = await profilePage.getDisplayName();
            expect(displayedName).toBe(newName);
        });
    });
});
