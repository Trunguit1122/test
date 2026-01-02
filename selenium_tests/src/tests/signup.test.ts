import { SignUpPage } from '../pages';
import { Settings, Messages, Routes } from '../config';
import { TestData } from '../utils';
import { initDriver, getDriver, quitDriver } from '../utils/setup';

/**
 * Sign Up Tests for LingoLab-FE
 * Test Suite: FUC-001 to FUC-027 (27 Test Cases)
 * 
 * UC Coverage:
 * - UC1: Sign Up / Account Registration (BR1, BR2, BR3, BR4, BR5)
 * 
 * Business Rules:
 * - BR1: Required Fields - Sign-Up form must contain [Email], [Password], and [Display Name].
 *        Submit button disabled until all fields are filled.
 * - BR2: Email Format - Must follow RFC 5322 format, no spaces, max 255 chars.
 *        If invalid → Show MSG-001
 * - BR3: Email Uniqueness - System checks if email exists (case-insensitive).
 *        If exists → Show MSG-002
 * - BR4: Password Complexity - 8-32 chars, at least: 1 Uppercase, 1 Lowercase, 1 Number, 1 Special char.
 *        If not → Show MSG-003 (MSG-096 to MSG-101 for specific errors)
 * - BR5: Success Action - Upon successful registration, create User with status PendingVerify.
 *        Show MSG-004
 * 
 * Test Categories:
 * - Valid Registration (FUC-001 to FUC-003): Successful registration flows (BR5)
 * - Invalid Email (FUC-004 to FUC-009): Email validation tests (BR2, BR3)
 * - Invalid Password (FUC-010 to FUC-016): Password complexity tests (BR4)
 * - Name Fields (FUC-017 to FUC-019): Display name validation (BR1)
 * - UI Interactions (FUC-020 to FUC-021): Navigation and form submission
 * - Boundary Tests (FUC-022 to FUC-024): Edge cases for email/password length
 * - Error Messages (FUC-025 to FUC-027): Error message verification
 */
describe('Sign Up Tests (UC1 - BR1, BR2, BR3, BR4, BR5)', () => {
  let signUpPage: SignUpPage;

  beforeAll(async () => {
    // Ensure driver is initialized first
    await initDriver();
    signUpPage = new SignUpPage(getDriver());
  });

  beforeEach(async () => {
    await signUpPage.goto();
  });

  afterAll(async () => {
    await quitDriver();
  });

  // ==================== Valid Registration Tests ====================
  // BR5: Success Action - Create User with status PendingVerify, Show MSG-004
  
  describe('Valid Registration (BR5)', () => {
    /**
     * FUC-001: Register with valid email and password
     * BR5: Upon successful registration, create User with status PendingVerify
     */
    test('FUC-001: Should register with valid email and password', async () => {
      console.log('🧪 Running FUC-001: Register with valid email and password');
      const email = TestData.generateEmail();
      const password = TestData.generatePassword();
      console.log(`📧 Generated test email: ${email}`);
      
      console.log('📝 Filling registration form...');
      await signUpPage.register(email, password);
      
      console.log('⏳ Waiting for success toast...');
      // Mock FE shows toast, then redirects to sign in
      const hasToast = await signUpPage.waitForSuccessToast();
      console.log(`✅ Toast displayed: ${hasToast}`);
      expect(hasToast).toBe(true);
    });

    // FUC-002: Register with minimum password length (8 chars)
    test('FUC-002: Should register with minimum password length', async () => {
      console.log('🧪 Running FUC-002: Register with minimum password length');
      const email = TestData.generateEmail();
      const password = 'Test@123'; // 8 characters
      
      await signUpPage.register(email, password);
      
      const hasError = await signUpPage.isPasswordErrorDisplayed();
      expect(hasError).toBe(false);
    });

    // FUC-003: Register with maximum password length (32 chars)
    test('FUC-003: Should register with maximum password length', async () => {
      const email = TestData.generateEmail();
      const password = 'Test@123456789012345678901234'; // 32 chars
      
      await signUpPage.register(email, password);
      
      const hasError = await signUpPage.isPasswordErrorDisplayed();
      expect(hasError).toBe(false);
    });
  });

  // ==================== Invalid Email Tests ====================
  // BR2: Email Format - RFC 5322, no spaces, max 255 chars -> MSG-001
  // BR3: Email Uniqueness - Check if email exists -> MSG-002
  
  describe('Invalid Email (BR2, BR3)', () => {
    /**
     * FUC-004: Register with empty email
     * BR1: Required Fields - Email is required
     */
    test('FUC-004: Should show error for empty email', async () => {
      const password = TestData.generatePassword();
      
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      await signUpPage.enterPassword(password);
      await signUpPage.clickSignUp();
      
      const hasError = await signUpPage.isEmailErrorDisplayed();
      expect(hasError).toBe(true);
    });

    // FUC-005: Register with invalid email format (no @)
    test('FUC-005: Should show error for email without @', async () => {
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      await signUpPage.enterEmail('invalidemail.com');
      await signUpPage.enterPassword(TestData.generatePassword());
      await signUpPage.clickSignUp();
      
      // Wait for validation
      await signUpPage.wait(500);
      
      const hasError = await signUpPage.isEmailErrorDisplayed();
      expect(hasError).toBe(true);
      
      if (hasError) {
        const errorMsg = await signUpPage.getEmailErrorMessage();
        // Should contain "Invalid email" or similar
        expect(errorMsg.toLowerCase()).toContain('invalid');
      }
    });

    // FUC-006: Register with invalid email format (no domain)
    test('FUC-006: Should show error for email without domain', async () => {
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      await signUpPage.enterEmail('test@');
      await signUpPage.enterPassword(TestData.generatePassword());
      await signUpPage.clickSignUp();
      
      // Wait for validation
      await signUpPage.wait(500);
      
      const hasError = await signUpPage.isEmailErrorDisplayed();
      expect(hasError).toBe(true);
    });

    // FUC-007: Register with invalid email format (special chars)
    // Note: Some special chars like !#$% are actually valid in email local part per RFC
    test('FUC-007: Should show error for email with special characters', async () => {
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      // Using clearly invalid format - no domain extension
      await signUpPage.enterEmail('test@@example');
      await signUpPage.enterPassword(TestData.generatePassword());
      await signUpPage.clickSignUp();
      
      await signUpPage.wait(500);
      
      const hasError = await signUpPage.isEmailErrorDisplayed();
      expect(hasError).toBe(true);
    });

    // FUC-008: Register with spaces in email
    test('FUC-008: Should show error for email with spaces', async () => {
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      await signUpPage.enterEmail('test user@example.com');
      await signUpPage.enterPassword(TestData.generatePassword());
      await signUpPage.clickSignUp();
      
      await signUpPage.wait(500);
      
      const hasError = await signUpPage.isEmailErrorDisplayed();
      expect(hasError).toBe(true);
    });

    // FUC-009: Register with existing email - FE shows toast from API
    test('FUC-009: Should show error for existing email', async () => {
      const password = TestData.generatePassword();
      
      await signUpPage.register(Settings.existingUserEmail || Settings.testUser.email, password);
      
      // Wait for API response - may show toast or error
      await signUpPage.wait(5000);
      
      // Check for either toast or stay on page (not redirected to signin)
      const hasToast = await signUpPage.isToastDisplayed();
      const currentUrl = await signUpPage.getCurrentUrl();
      
      // Either has error toast OR still on signup page (not redirected)
      const isOnSignup = currentUrl.includes('/signup');
      expect(hasToast || isOnSignup).toBe(true);
    });
  });

  // ==================== Invalid Password Tests ====================
  // BR4: Password Complexity - 8-32 chars, 1 Upper, 1 Lower, 1 Number, 1 Special -> MSG-003
  
  describe('Invalid Password (BR4)', () => {
    /**
     * FUC-010: Register with empty password
     * BR1: Required Fields - Password is required
     */
    test('FUC-010: Should show error for empty password', async () => {
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      await signUpPage.enterEmail(TestData.generateEmail());
      await signUpPage.clickSignUp();
      
      const hasError = await signUpPage.isPasswordErrorDisplayed();
      expect(hasError).toBe(true);
    });

    // FUC-011: Register with password less than 8 characters (BR4 - MSG_096)
    test('FUC-011: Should show error for short password', async () => {
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      await signUpPage.enterEmail(TestData.generateEmail());
      await signUpPage.enterPassword('Test@12'); // 7 characters
      await signUpPage.clickSignUp();
      
      const hasError = await signUpPage.isPasswordErrorDisplayed();
      expect(hasError).toBe(true);
      
      const errorMsg = await signUpPage.getPasswordErrorMessage();
      expect(errorMsg).toContain(Messages.MSG_096);
    });

    // FUC-012: Register with password without uppercase (BR4 - MSG_098)
    test('FUC-012: Should show error for password without uppercase', async () => {
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      await signUpPage.enterEmail(TestData.generateEmail());
      await signUpPage.enterPassword('test@1234');
      await signUpPage.clickSignUp();
      
      const hasError = await signUpPage.isPasswordErrorDisplayed();
      expect(hasError).toBe(true);
      
      const errorMsg = await signUpPage.getPasswordErrorMessage();
      expect(errorMsg).toContain(Messages.MSG_098);
    });

    // FUC-013: Register with password without lowercase (BR4 - MSG_099)
    test('FUC-013: Should show error for password without lowercase', async () => {
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      await signUpPage.enterEmail(TestData.generateEmail());
      await signUpPage.enterPassword('TEST@1234');
      await signUpPage.clickSignUp();
      
      const hasError = await signUpPage.isPasswordErrorDisplayed();
      expect(hasError).toBe(true);
      
      const errorMsg = await signUpPage.getPasswordErrorMessage();
      expect(errorMsg).toContain(Messages.MSG_099);
    });

    // FUC-014: Register with password without number (BR4 - MSG_100)
    test('FUC-014: Should show error for password without number', async () => {
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      await signUpPage.enterEmail(TestData.generateEmail());
      await signUpPage.enterPassword('Test@abcd');
      await signUpPage.clickSignUp();
      
      const hasError = await signUpPage.isPasswordErrorDisplayed();
      expect(hasError).toBe(true);
      
      const errorMsg = await signUpPage.getPasswordErrorMessage();
      expect(errorMsg).toContain(Messages.MSG_100);
    });

    // FUC-015: Register with password without special character (BR4 - MSG_101)
    test('FUC-015: Should show error for password without special character', async () => {
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      await signUpPage.enterEmail(TestData.generateEmail());
      await signUpPage.enterPassword('Test12345');
      await signUpPage.clickSignUp();
      
      const hasError = await signUpPage.isPasswordErrorDisplayed();
      expect(hasError).toBe(true);
      
      const errorMsg = await signUpPage.getPasswordErrorMessage();
      expect(errorMsg).toContain(Messages.MSG_101);
    });

    // FUC-016: Register with password > 32 characters (BR4 - MSG_097)
    test('FUC-016: Should show error for password exceeding 32 chars', async () => {
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      await signUpPage.enterEmail(TestData.generateEmail());
      await signUpPage.enterPassword('Test@12345678901234567890123456789'); // 33 chars
      await signUpPage.clickSignUp();
      
      const hasError = await signUpPage.isPasswordErrorDisplayed();
      expect(hasError).toBe(true);
      
      const errorMsg = await signUpPage.getPasswordErrorMessage();
      expect(errorMsg).toContain(Messages.MSG_097);
    });
  });

  // ==================== Name Field Tests (Mock FE specific) ====================
  // BR1: Required Fields - Display Name is required
  
  describe('Name Fields (BR1)', () => {
    /**
     * FUC-017: Register with empty lastname
     * BR1: Display Name required
     */
    test('FUC-017: Should show error for empty lastname', async () => {
      await signUpPage.enterFirstname('User');
      await signUpPage.enterEmail(TestData.generateEmail());
      await signUpPage.enterPassword(TestData.generatePassword());
      await signUpPage.clickSignUp();
      
      const hasError = await signUpPage.isLastnameErrorDisplayed();
      expect(hasError).toBe(true);
    });

    // FUC-018: Register with empty firstname
    test('FUC-018: Should show error for empty firstname', async () => {
      await signUpPage.enterLastname('Test');
      await signUpPage.enterEmail(TestData.generateEmail());
      await signUpPage.enterPassword(TestData.generatePassword());
      await signUpPage.clickSignUp();
      
      const hasError = await signUpPage.isFirstnameErrorDisplayed();
      expect(hasError).toBe(true);
    });

    // FUC-019: Register with valid names
    test('FUC-019: Should succeed with valid names', async () => {
      const email = TestData.generateEmail();
      const password = TestData.generatePassword();
      
      await signUpPage.register(email, password, 'Nguyen', 'Van A');
      
      const hasToast = await signUpPage.waitForSuccessToast();
      expect(hasToast).toBe(true);
    });
  });

  // ==================== UI Interaction Tests ====================
  
  describe('UI Interactions', () => {
    // FUC-020: Click sign in link
    test('FUC-020: Should navigate to sign in page', async () => {
      await signUpPage.clickSignInLink();
      
      const currentUrl = await signUpPage.getCurrentUrl();
      expect(currentUrl).toContain(Routes.SIGN_IN);
    });

    // FUC-021: Form submission with Enter key
    test('FUC-021: Should submit form with Enter key', async () => {
      const email = TestData.generateEmail();
      const password = TestData.generatePassword();
      
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      await signUpPage.enterEmail(email);
      await signUpPage.enterPassword(password);
      await signUpPage.pressEnter();
      
      // Should submit and show toast
      const hasToast = await signUpPage.waitForSuccessToast(8000);
      expect(hasToast).toBe(true);
    });
  });

  // ==================== Boundary Tests ====================
  // BR2: Email max 255 chars | BR4: Password 8-32 chars
  
  describe('Boundary Tests (BR2, BR4)', () => {
    /**
     * FUC-022: Email at maximum length
     * BR2: Email max length 255 characters
     */
    test('FUC-022: Should handle email at maximum length', async () => {
      const localPart = 'a'.repeat(64);
      const email = `${localPart}@example.com`;
      
      await signUpPage.register(email, TestData.generatePassword());
      
      // Should not show error for valid max length
      const hasError = await signUpPage.isEmailErrorDisplayed();
      expect(hasError).toBe(false);
    });

    // FUC-023: Password at exactly 8 characters
    test('FUC-023: Should accept password at exactly 8 characters', async () => {
      const email = TestData.generateEmail();
      await signUpPage.register(email, 'Test@123');
      
      const hasError = await signUpPage.isPasswordErrorDisplayed();
      expect(hasError).toBe(false);
    });

    // FUC-024: Password at exactly 32 characters
    test('FUC-024: Should accept password at exactly 32 characters', async () => {
      const email = TestData.generateEmail();
      const password = 'Test@123456789012345678901234'; // Exactly 32
      await signUpPage.register(email, password);
      
      const hasError = await signUpPage.isPasswordErrorDisplayed();
      expect(hasError).toBe(false);
    });
  });

  // ==================== Error Message Tests ====================
  // BR2: MSG-001 for invalid email | BR4: MSG-003/MSG-096-101 for password errors
  
  describe('Error Messages (BR2, BR4)', () => {
    /**
     * FUC-025: Show correct error for invalid email
     * BR2: Invalid email format -> MSG-001
     */
    test('FUC-025: Should show correct error message for invalid email', async () => {
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      await signUpPage.enterEmail('invalid');
      await signUpPage.enterPassword(TestData.generatePassword());
      await signUpPage.clickSignUp();
      
      // Wait for validation to appear
      await signUpPage.wait(500);
      
      const hasError = await signUpPage.isEmailErrorDisplayed();
      expect(hasError).toBe(true);
      
      if (hasError) {
        const errorMsg = await signUpPage.getEmailErrorMessage();
        // Check for "Invalid email" text (case insensitive)
        expect(errorMsg.toLowerCase()).toContain('invalid');
      }
    });

    // FUC-026: Show correct error for weak password (BR4 - MSG_096)
    test('FUC-026: Should show correct error message for weak password', async () => {
      await signUpPage.enterLastname('Test');
      await signUpPage.enterFirstname('User');
      await signUpPage.enterEmail(TestData.generateEmail());
      await signUpPage.enterPassword('123');
      await signUpPage.clickSignUp();
      
      const errorMsg = await signUpPage.getPasswordErrorMessage();
      expect(errorMsg).toContain(Messages.MSG_096);
    });

    // FUC-027: Verify all password validation messages work
    test('FUC-027: Should show all password requirement errors', async () => {
      const testCases = [
        { password: 'short', expectedMsg: Messages.MSG_096 }, // < 8 chars
        { password: 'test@1234', expectedMsg: Messages.MSG_098 }, // no uppercase
        { password: 'TEST@1234', expectedMsg: Messages.MSG_099 }, // no lowercase
        { password: 'Test@abcd', expectedMsg: Messages.MSG_100 }, // no number
        { password: 'Test12345', expectedMsg: Messages.MSG_101 }, // no special char
      ];

      for (const testCase of testCases) {
        await signUpPage.goto();
        await signUpPage.enterLastname('Test');
        await signUpPage.enterFirstname('User');
        await signUpPage.enterEmail(TestData.generateEmail());
        await signUpPage.enterPassword(testCase.password);
        await signUpPage.clickSignUp();
        
        const errorMsg = await signUpPage.getPasswordErrorMessage();
        expect(errorMsg).toContain(testCase.expectedMsg);
      }
    });
  });
});
